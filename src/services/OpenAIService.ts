import OpenAI from 'openai';
import { IAIService } from '../interfaces/IAIService';
import { AI_PROMPTS } from '../constants/aiPrompts';

export class OpenAIService implements IAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey
    });
  }

  async getEligibilityDetails(eligibilityDetails: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: AI_PROMPTS.ELIGIBILITY_DETAILS(eligibilityDetails) as OpenAI.Chat.ChatCompletionMessageParam[],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('Failed to get response from OpenAI');
    }

    const parsedResult = JSON.parse(result);
    return parsedResult.eligibility;
  }

  async getRequirementsUSResidency(eligibilityDetails: string): Promise<boolean> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: AI_PROMPTS.US_RESIDENCY_CHECK(eligibilityDetails) as OpenAI.Chat.ChatCompletionMessageParam[],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('Failed to get response from OpenAI');
    }

    const parsedResult = JSON.parse(result);
    return parsedResult.requiresUSResidency === true;
  }

  async getRequirementsInsuranceCoverage(coverageEligibilities: string): Promise<boolean> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: AI_PROMPTS.INSURANCE_COVERAGE_CHECK(coverageEligibilities) as OpenAI.Chat.ChatCompletionMessageParam[],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('Failed to get response from OpenAI');
    }

    const parsedResult = JSON.parse(result);
    return parsedResult.isCoveredByInsurance === true;
  }

  async getRequirementsMinimumAge(eligibilityDetails: string): Promise<number> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: AI_PROMPTS.MINIMUM_AGE_CHECK(eligibilityDetails) as OpenAI.Chat.ChatCompletionMessageParam[],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('Failed to get response from OpenAI');
    }

    const parsedResult = JSON.parse(result);
    return parsedResult.minimumAge;
  }

  async getRequirementsElegibilityLength(eligibilityDetails: string): Promise<number> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: AI_PROMPTS.ELIGIBILITY_LENGTH_CHECK(eligibilityDetails) as OpenAI.Chat.ChatCompletionMessageParam[],
      response_format: { type: 'json_object' },
      temperature: 0.1
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error('Failed to get response from OpenAI');
    }

    const parsedResult = JSON.parse(result);
    return parsedResult.eligibilityLength;
  }
}
