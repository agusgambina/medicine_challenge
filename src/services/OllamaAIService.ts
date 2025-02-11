import { Ollama } from 'ollama';
import { IAIService } from '../interfaces/IAIService';
import { AI_PROMPTS } from '../constants/aiPrompts';

export class OllamaAIService implements IAIService {
  private ollama: Ollama;

  constructor(apiKey: string) {
    // Ollama doesn't require an API key, but we'll keep the constructor signature for consistency
    this.ollama = new Ollama({
      host: 'http://localhost:11434' // Default Ollama host
    });
  }

  async getEligibilityDetails(eligibilityDetails: string): Promise<string> {
    const response = await this.ollama.chat({
      model: 'mistral', // Using mistral as default model, can be configured as needed
      messages: AI_PROMPTS.ELIGIBILITY_DETAILS(eligibilityDetails),
      format: 'json',
      stream: false
    });

    if (!response.message?.content) {
      throw new Error('Failed to get response from Ollama');
    }

    try {
      const parsedResult = JSON.parse(response.message.content);
      return parsedResult.eligibility;
    } catch (error) {
      throw new Error('Failed to parse Ollama response as JSON');
    }
  }

  async getRequirementsUSResidency(eligibilityDetails: string): Promise<boolean> {
    const response = await this.ollama.chat({
      model: 'mistral',
      messages: AI_PROMPTS.US_RESIDENCY_CHECK(eligibilityDetails),
      format: 'json',
      stream: false
    });

    if (!response.message?.content) {
      throw new Error('Failed to get response from Ollama');
    }

    try {
      const parsedResult = JSON.parse(response.message.content);
      return parsedResult.requiresUSResidency === true;
    } catch (error) {
      throw new Error('Failed to parse Ollama response as JSON');
    }
  }

  async getRequirementsInsuranceCoverage(coverageEligibilities: string): Promise<boolean> {
    const response = await this.ollama.chat({
      model: 'mistral',
      messages: AI_PROMPTS.INSURANCE_COVERAGE_CHECK(coverageEligibilities),
      format: 'json',
      stream: false
    });

    if (!response.message?.content) {
      throw new Error('Failed to get response from Ollama');
    }

    try {
      const parsedResult = JSON.parse(response.message.content);
      return parsedResult.isCoveredByInsurance === true;
    } catch (error) {
      throw new Error('Failed to parse Ollama response as JSON');
    }
  }

  async getRequirementsMinimumAge(eligibilityDetails: string): Promise<number> {
    const response = await this.ollama.chat({
      model: 'mistral',
      messages: AI_PROMPTS.MINIMUM_AGE_CHECK(eligibilityDetails),
      format: 'json',
      stream: false
    });

    if (!response.message?.content) {
      throw new Error('Failed to get response from Ollama');
    } 

    try {
      const parsedResult = JSON.parse(response.message.content);
      return parsedResult.minimumAge;
    } catch (error) {
      throw new Error('Failed to parse Ollama response as JSON');
    }
  }

  async getRequirementsElegibilityLength(eligibilityDetails: string): Promise<number> {
    const response = await this.ollama.chat({
      model: 'mistral',
      messages: AI_PROMPTS.ELIGIBILITY_LENGTH_CHECK(eligibilityDetails),
      format: 'json',
      stream: false
    });

    if (!response.message?.content) {
      throw new Error('Failed to get response from Ollama');
    }

    try {
      const parsedResult = JSON.parse(response.message.content);
      return parsedResult.eligibilityLength;
    } catch (error) {
      throw new Error('Failed to parse Ollama response as JSON');
    }
  }
}
