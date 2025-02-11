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
} 