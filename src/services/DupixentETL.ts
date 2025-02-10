import fs from 'fs/promises';
import { DupixentData } from '../types/dupixent';

export class DupixentETL {
  private data: DupixentData | null = null;

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
  transform() {
    if (!this.data) {
      throw new Error('No data loaded. Call extract() first.');
    }

    const checkString = (field: string, value: any) => {
      if (typeof value !== 'string') {
        console.error(`Error: ${field} is not a string`);
        return 'Unknown';
      }
      return value;
    }

    const checkArrayString = (field: string, value: any) => {
      if (!Array.isArray(value)) {
        console.error(`Error: ${field} is not an array of strings`);
        return ['Unknown'];
      }
      return value.every(item => typeof item === 'string') ? value : ['Unknown'];
    }

    const currencyFormatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    // Convert currency strings to numbers by removing currency symbols and parsing
    const annualMax = Number(String(this.data.AnnualMax || 0).replace(/[^0-9.-]+/g, ''));
    const maximumBenefit = Number(String(this.data.MaximumBenefit || 0).replace(/[^0-9.-]+/g, ''));

    // Asumptions
    // 1. The minimum out of pocket is 0
    // 2. The maximum annual savings is the difference between the annual max and the maximum benefit
    // 3. The minimum out of pocket is 0 if there is no income requirement
    return {
      programInfo: {
        program_name: checkString('Program Name', this.data.ProgramName),
        coverage_eligibilities: checkArrayString('Coverage Eligibilities', this.data.CoverageEligibilities),
        program_type: checkString('Program Type', this.data.AssistanceType),
        benefits: [{
          name: 'max_annual_savings',
          value: currencyFormatter.format(annualMax - maximumBenefit)
        }, {
          name: 'min_out_of_pocket',
          value: !this.data.IncomeReq ? '0.00' : currencyFormatter.format(0) // TODO: add logic to calculate min out of pocket
        }],
        details: [{
          eligibility: '',
          program: '',
          renewal: '',
          income: ''
        }]
      }
    };
  }

  /**
   * Load/save the transformed data
   */
  async load(outputPath: string, data: any): Promise<void> {
    try {
      await fs.writeFile(
        outputPath,
        JSON.stringify(data, null, 2),
        'utf-8'
      );
    } catch (error) {
      throw new Error(`Failed to load data: ${error}`);
    }
  }
} 