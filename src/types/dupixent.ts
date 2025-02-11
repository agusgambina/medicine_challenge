export interface NameValuePair {
  name: string;
  value: string;
}

export interface NameLinkPair {
  name: string;
  link: string;
}

export interface DupixentData {
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
} 