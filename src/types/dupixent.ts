export interface DupixentData {
  ProgramID: number;
  EnrollmentURL: any;
  AddRenewalDetails: string;
  IncomeDetails: string;
  ProgramDetails: any;
  EligibilityDetails(EligibilityDetails: any): unknown;
  ProgramName: string;
  CoverageEligibilities: string[];
  AssistanceType: string;
  AnnualMax: number | string | null;
  MaximumBenefit: number | string | null;
  IncomeReq: boolean;
  FundLevelType: string | null;
}

export interface ProgramTransformOutput {
  program_id: string;
  program_name: string;
  coverage_eligibilities: string[];
  program_type: string;
  benefits: Array<{
    name: string;
    value: string;
  }>;
  details: {
    eligibility: string;
    program: string;
    renewal: string;
    income: string;
  };
  requirements: Array<{
    name: 'us_residency' | 'minimum_age' | 'insurance_coverage' | 'eligibility_length';
    value: string;
  }>;
  forms: Array<{
    name: string;
    url: string;
  }>;
  funding: {
    evergreen: string;
    current_funding_level: string;
  };
}
