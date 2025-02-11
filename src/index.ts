import express, { Express, Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { DupixentETL } from './services/DupixentETL';
import { OpenAIService } from './services/OpenAIService';
import { OllamaAIService } from './services/OLlamaAIService';

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
    const openAIService = new OpenAIService(process.env.OPENAI_API_KEY || '');
    const ollamaService = new OllamaAIService('http://localhost:11434');
    const etl = new DupixentETL(ollamaService);
    
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