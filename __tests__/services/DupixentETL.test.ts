import { DupixentETL } from '@/services/DupixentETL';
import { IAIService } from '@/interfaces/IAIService';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('DupixentETL', () => {
  let mockData: any;
  let etl: DupixentETL;
  let mockAIService: jest.Mocked<IAIService>;

  beforeEach(() => {
    mockAIService = {
      getEligibilityDetails: jest
        .fn()
        .mockResolvedValue(
          'Patient must have commercial insurance, not valid for those with Medicaid, Medicare, VA, DOD, TRICARE, or other federal/state programs, or cash-paying patients. Must be prescribed for an FDA-approved indication and be a legal resident of the US or its territories. Certain state residents may be ineligible.'
        ),
      getRequirementsUSResidency: jest.fn().mockResolvedValue(true),
      getRequirementsMinimumAge: jest.fn().mockResolvedValue(18),
      getRequirementsInsuranceCoverage: jest.fn().mockResolvedValue(true),
      getRequirementsElegibilityLength: jest.fn().mockResolvedValue(12)
    } as unknown as jest.Mocked<IAIService>;
    etl = new DupixentETL(mockAIService);
    mockData = {
      ProgramName: 'Test Program',
      CoverageEligibilities: ['Test Coverage Eligibility'],
      AssistanceType: 'Test Program Type',
      AnnualMax: '$13,000',
      MaximumBenefit: null,
      IncomeReq: false,
      EligibilityDetails:
        '- Patient must have commercial insurance, including health insurance exchanges, federal employee plans, or state employee plans\n- Not valid for prescriptions paid, in whole or in part, by Medicaid, Medicare, VA, DOD, TRICARE, or other federal or state programs including any state pharmaceutical assistance programs\n- Program offer is not valid for cash-paying patients\n- Patient must be prescribed the Program Product for an FDA-approved indication\n- Patient must be a legal resident of the US or a US territory\n- Patients residing in or receiving treatment in certain states may not be eligible',
      ProgramDetails:
        '-  Eligible patients may pay as little as $0 for every month of Dupixent\n-  The maximum annual patient benefit under the Dupixent MyWay Copay Card Program is $13,000\n-  Patient will receive copay card information via email following online enrollment & eligibility questions\n-  Ongoing follow-up and education are provided by the Nurse Educator to help patients stay on track with DUPIXENT\n-  Patient will be automatically re-enrolled every January 1st provided that their card has been used within 18 months\n-  For assistance or additional information, call 844-387-4936, option 1, Monday-Friday, 8 am-9 pm ET\n-  Pharmacists: for questions, call the LoyaltyScript program at 855-520-3765 (8am-8pm EST, Monday-Friday)',
      AddRenewalDetails:
        'Patient will be automatically re-enrolled every January 1st provided that their card has been used within 18 months',
      IncomeDetails: 'Data Not Available',
      EnrollmentURL: 'https://www.dupixent.com/support-savings/copay-card'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('extract', () => {
    it('should extract data from JSON file - program_name', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.program_name).toBe('Test Program');
    });

    it('should extract data from JSON file - program_name not a string', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      mockData = {
        ...mockData,
        ProgramName: 123
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.program_name).toBe('Unknown');
      expect(consoleSpy).toHaveBeenCalledWith('Error: Program Name is not a string');
      consoleSpy.mockRestore();
    });

    it('should extract data from JSON file - coverage_eligibilities', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.coverage_eligibilities).toEqual(['Test Coverage Eligibility']);
    });

    it('should extract data from JSON file - coverage_eligibilities not an array', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      mockData = {
        ...mockData,
        CoverageEligibilities: 'Test Coverage Eligibility'
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.coverage_eligibilities).toEqual(['Unknown']);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error: Coverage Eligibilities is not an array of strings'
      );
      consoleSpy.mockRestore();
    });

    it('should extract data from JSON file - program_type', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.program_type).toBe('Test Program Type');
    });

    it('should extract data from JSON file - program_type not string', async () => {
      const consoleSpy = jest.spyOn(console, 'error');
      mockData = {
        ...mockData,
        AssistanceType: 123
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.program_type).toBe('Unknown');
      expect(consoleSpy).toHaveBeenCalledWith('Error: Program Type is not a string');
      consoleSpy.mockRestore();
    });

    it('should extract data from JSON file - benefits', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.benefits).toEqual([
        {
          name: 'max_annual_savings',
          value: '$13,000.00'
        },
        {
          name: 'min_out_of_pocket',
          value: '0.00'
        }
      ]);
    });

    it('should extract data from JSON file - details', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.details).toEqual({
        eligibility:
          'Patient must have commercial insurance, not valid for those with Medicaid, Medicare, VA, DOD, TRICARE, or other federal/state programs, or cash-paying patients. Must be prescribed for an FDA-approved indication and be a legal resident of the US or its territories. Certain state residents may be ineligible.',
        program:
          '-  Eligible patients may pay as little as $0 for every month of Dupixent\n-  The maximum annual patient benefit under the Dupixent MyWay Copay Card Program is $13,000\n-  Patient will receive copay card information via email following online enrollment & eligibility questions\n-  Ongoing follow-up and education are provided by the Nurse Educator to help patients stay on track with DUPIXENT\n-  Patient will be automatically re-enrolled every January 1st provided that their card has been used within 18 months\n-  For assistance or additional information, call 844-387-4936, option 1, Monday-Friday, 8 am-9 pm ET\n-  Pharmacists: for questions, call the LoyaltyScript program at 855-520-3765 (8am-8pm EST, Monday-Friday)',
        renewal:
          'Patient will be automatically re-enrolled every January 1st provided that their card has been used within 18 months',
        income: 'Not required'
      });
    });

    it('should extract data from JSON file - requirements', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.requirements).toEqual([
        {
          name: 'us_residency',
          value: 'true'
        },
        {
          name: 'minimum_age',
          value: '18'
        },
        {
          name: 'insurance_coverage',
          value: 'true'
        },
        {
          name: 'eligibility_length',
          value: '12m'
        }
      ]);
    });

    it('should extract data from JSON file - forms', async () => {
      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = await etl.transform();

      expect(transformed.forms).toEqual([
        {
          name: 'Enrollment Form',
          url: 'https://www.dupixent.com/support-savings/copay-card'
        }
      ]);
    });

    it('should throw error on file read failure', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      await expect(etl.extract('test.json')).rejects.toThrow('Failed to extract data');
    });
  });
});
