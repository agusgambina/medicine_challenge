import { DupixentETL } from '@/services/DupixentETL';
import fs from 'fs/promises';

jest.mock('fs/promises');

describe('DupixentETL', () => {
  let etl: DupixentETL;

  beforeEach(() => {
    etl = new DupixentETL();
    jest.clearAllMocks();
  });

  describe('extract', () => {
    it('should extract data from JSON file - program_name', async () => {
      const mockData = {
        ProgramName: 'Test Program'
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = etl.transform();

      expect(transformed.programInfo.program_name).toBe('Test Program');
    });

    it('should extract data from JSON file - coverage_eligibilities', async () => {
      const mockData = {
        CoverageEligibilities: ['Test Coverage Eligibility']
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = etl.transform();

      expect(transformed.programInfo.coverage_eligibilities).toEqual(['Test Coverage Eligibility']);
    });

    it('should extract data from JSON file - program_type', async () => {
      const mockData = {
        AssistanceType: 'Test Program Type'
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = etl.transform();

      expect(transformed.programInfo.program_type).toBe('Test Program Type');
    });

    it('should extract data from JSON file - benefits', async () => {
      const mockData = {
        AnnualMax: '$13,000',
        MaximumBenefit: null,
        IncomeReq: false
      };

      (fs.readFile as jest.Mock).mockResolvedValue(JSON.stringify(mockData));

      await etl.extract('test.json');
      const transformed = etl.transform();

      expect(transformed.programInfo.benefits).toEqual([
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

    it('should throw error on file read failure', async () => {
      (fs.readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      await expect(etl.extract('test.json')).rejects.toThrow('Failed to extract data');
    });
  });
});
