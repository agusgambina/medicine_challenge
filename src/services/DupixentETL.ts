import fs from 'fs/promises';
import { DupixentData } from '../types/dupixent';
import { IAIService, OutputDetailsSchema } from '../interfaces/IAIService';
import { OpenAIService } from './OpenAIService';

export class DupixentETL {
  private data: DupixentData | null = null;

  constructor(private aiService: IAIService) {
    if (!aiService) {
      throw new Error('AI service is required');
    }
    this.aiService = aiService;
  }

  /**
   * Extract data from the JSON file
   */
  async extract(filePath: string): Promise<void> {
    try {
      const rawData = await fs.readFile(filePath, 'utf-8');
      this.data = JSON.parse(rawData) as DupixentData;
    } catch (error) {
      throw new Error(`Failed to extract data: ${error}`);
    }
  }

  /**
   * Transform the data into useful formats
   */
  async transform() {
    if (!this.data) {
      throw new Error('No data loaded. Call extract() first.');
    }

    const checkString = (field: string, value: any) => {
      if (typeof value !== 'string') {
        console.error(`Error: ${field} is not a string`);
        return 'Unknown';
      }
      return value;
    };

    const checkArrayString = (field: string, value: any) => {
      if (!Array.isArray(value)) {
        console.error(`Error: ${field} is not an array of strings`);
        return ['Unknown'];
      }
      return value.every((item) => typeof item === 'string') ? value : ['Unknown'];
    };

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Convert currency strings to numbers by removing currency symbols and parsing
    const annualMax = Number(String(this.data.AnnualMax || 0).replace(/[^0-9.-]+/g, ''));
    const maximumBenefit = Number(String(this.data.MaximumBenefit || 0).replace(/[^0-9.-]+/g, ''));

    // Get details from AI service
    const details: OutputDetailsSchema = {
      eligibility: await this.aiService.getEligibilityDetails(
        String(this.data.EligibilityDetails || '')
      ),
      program: this.data.ProgramDetails,
      renewal: this.data.AddRenewalDetails,
      income: this.data.IncomeReq ? this.data.IncomeDetails : 'Not required'
    };

    // Assumptions
    // 1. The minimum out of pocket is 0
    // 2. The maximum annual savings is the difference between the annual max and the maximum benefit
    // 3. The minimum out of pocket is 0 if there is no income requirement
    return {
      programInfo: {
        program_name: checkString('Program Name', this.data.ProgramName),
        coverage_eligibilities: checkArrayString(
          'Coverage Eligibilities',
          this.data.CoverageEligibilities
        ),
        program_type: checkString('Program Type', this.data.AssistanceType),
        benefits: [
          {
            name: 'max_annual_savings',
            value: currencyFormatter.format(annualMax - maximumBenefit)
          },
          {
            name: 'min_out_of_pocket',
            value: !this.data.IncomeReq ? '0.00' : currencyFormatter.format(0)
          }
        ],
        details,
        requirements: [
          {
            name: 'us_residency',
            value: String(await this.aiService.getRequirementsUSResidency(String(this.data.EligibilityDetails || '')))
          },
          {
            name: 'minimum_age',
            value: String(await this.aiService.getRequirementsMinimumAge(String(this.data.EligibilityDetails || '')))
          },
          {
            name: 'insurance_coverage',
            value: String(await this.aiService.getRequirementsInsuranceCoverage(String(this.data.EligibilityDetails || '')))
          },
          {
            name: 'eligibility_length',
            value: `${String(await this.aiService.getRequirementsElegibilityLength(String(this.data.EligibilityDetails || '')))}m`
          }
        ],
        forms: [
          {
            name: 'Enrollment Form',
            url: this.data.EnrollmentURL
          }
        ],
        // TODO: check if funding is correct, or where to get it
        funding: {
          evergreen: 'true',
          current_funding_level: 'Data Not Available'
        }
      }
    };
  }

  /**
   * Load/save the transformed data
   */
  async load(outputPath: string, data: any): Promise<void> {
    try {
      await fs.writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      throw new Error(`Failed to load data: ${error}`);
    }
  }
}
