export interface NameValuePair {
  name: string;
  value: string;
}

export interface NameLinkPair {
  name: string;
  link: string;
}

export interface DupixentData {
  ProgramName: string;
  CoverageEligibilities: string[];
  AssistanceType: string;
  AnnualMax: number | string | null;
  MaximumBenefit: number | string | null;
  IncomeReq: boolean;
} 