/**
 * Represents possible response types from OpenAI service
 */
export type AIResponse = string | Record<string, any>;

/**
 * Schema configuration for output format
 */
export type OutputDetailsSchema = {
  eligibility: string;
  program: string;
  renewal: string;
  income: string;
};

/**
 * Interface defining the contract for AI service
 */
export interface IAIService {
  /**
   * Get program details from AI service
   * @param data - The data to get program details from
   * @returns Promise resolving to program details
   */
  getEligibilityDetails(eligibilityDetails: string): Promise<string>;

  /**
   * Get requirements if US residency is required from AI service
   * @param eligibilityDetails - The eligibility details to get requirements from
   * @returns Promise resolving to true if US residency is required, false if not
   */
  getRequirementsUSResidency(eligibilityDetails: string): Promise<boolean>;

  /**
   * Get requirements if minimum age is required from AI service
   * @param eligibilityDetails - The eligibility details to get requirements from
   * @returns Promise resolving to true if minimum age is required, false if not
   */
  getRequirementsMinimumAge(eligibilityDetails: string): Promise<number>;

  /**
   * Get requirements if insurance is covering the program from AI service
   * @param coverageEligibilities - The coverage eligibilities to get requirements from
   * @returns Promise resolving to true if insurance is covering the program, false if not
   */
  getRequirementsInsuranceCoverage(coverageEligibilities: string): Promise<boolean>;

  /**
   * Get eligibility length is required from AI service if missing from data return 12 months as default
   * @param eligibilityDetails - The eligibility details to get requirements from
   * @returns Promise resolving to the eligibility length
   */
  getRequirementsElegibilityLength(eligibilityDetails: string): Promise<number>;
} 