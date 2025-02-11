import { Ollama } from 'ollama';
import { IAIService } from '../interfaces/IAIService';

export class OllamaAIService implements IAIService {
  private ollama: Ollama;

  constructor(apiKey: string) {
    // Ollama doesn't require an API key, but we'll keep the constructor signature for consistency
    this.ollama = new Ollama({
      host: 'http://localhost:11434', // Default Ollama host
    });
  }
  
  async getEligibilityDetails(eligibilityDetails: string): Promise<string> {
    const response = await this.ollama.chat({
      model: "mistral", // Using mistral as default model, can be configured as needed
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
      format: "json",
      stream: false
    });

    if (!response.message?.content) {
      throw new Error("Failed to get response from Ollama");
    }

    try {
      const parsedResult = JSON.parse(response.message.content);
      return parsedResult.eligibility;
    } catch (error) {
      throw new Error("Failed to parse Ollama response as JSON");
    }
  }
}
