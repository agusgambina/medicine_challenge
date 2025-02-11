import express, { Express, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { DupixentETL } from './services/DupixentETL';
import { OpenAIService } from './services/OpenAIService';
import { OllamaAIService } from './services/OllamaAIService';

// Configure dotenv at the start
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript!' });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

async function main() {
  try {
    // Get AI service type from command line arguments (skip first two args from ts-node)
    const aiService = process.argv[2]?.toLowerCase();
    
    if (!aiService || !['ollama', 'openai'].includes(aiService)) {
      console.error('Usage: yarn etl <ollama|openai>');
      process.exit(1);
    }

    let aiServiceInstance;
    if (aiService === 'openai') {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required for OpenAI service');
      }
      aiServiceInstance = new OpenAIService(process.env.OPENAI_API_KEY);
    } else {
      if (!process.env.OLLAMA_URL) {
        throw new Error('OLLAMA_URL environment variable is required for Ollama service');
      }
      aiServiceInstance = new OllamaAIService(process.env.OLLAMA_URL);
    }

    const etl = new DupixentETL(aiServiceInstance);
    
    // Extract
    await etl.extract(path.join(__dirname, '../data/dupixent.json'));
    
    // Transform
    const transformedData = await etl.transform();
    
    // Load
    await etl.load(
      path.join(__dirname, '../output/dupixent-transformed.json'),
      transformedData
    );

    console.log('ETL process completed successfully');
    console.log('Transformed data summary:', transformedData);

  } catch (error) {
    console.error('ETL process failed:', error);
  }
}

main(); 