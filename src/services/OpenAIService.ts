import OpenAI from 'openai';
import { IAIService } from '../interfaces/IAIService';

export class OpenAIService implements IAIService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }
  
  async getEligibilityDetails(eligibilityDetails: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that simplifies eligibility requirements. Parse and summarize the most important eligibility criteria, focusing on age limits, geographic restrictions, or insurance conditions. Provide a concise, clear response."
        },
        {
          role: "user",
          content: `Please analyze these eligibility requirements and provide a simplified version focusing on the key insurance and residency requirements. Format the response as a JSON object with a single 'eligibility' field containing the simplified string:\n\n${eligibilityDetails}`
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const result = response.choices[0].message.content;
    if (!result) {
      throw new Error("Failed to get response from OpenAI");
    }

    const parsedResult = JSON.parse(result);
    return parsedResult.eligibility;
  }
}
