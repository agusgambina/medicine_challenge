import express, { Express } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { ProgramETL } from './services/ProgramETL';
import { OpenAIService } from './services/OpenAIService';
import { OllamaAIService } from './services/OllamaAIService';
import routes from './routes';

// Configure dotenv at the start
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Allow all origins by default, or specify from env
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Or apply to specific routes in your routes file
app.use('/', routes);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});

async function main() {
  try {
    // Get AI service type from command line arguments (skip first two args from ts-node)
    const aiService = process.argv[2]?.toLowerCase() || 'ollama';
    
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

    const etl = new ProgramETL(aiServiceInstance);
    
    // Extract
    await etl.extract(path.join(__dirname, `../data/${process.env.PROGRAM_NAME}.json`));
    
    // Transform
    const transformedData = await etl.transform();
    
    // Load
    await etl.load(
      path.join(__dirname, `../output_programs/${process.env.PROGRAM_NAME}-transformed.json`),
      transformedData
    );

    console.log('ETL process completed successfully');
    console.log('Transformed data summary:', transformedData);

  } catch (error) {
    console.error('ETL process failed:', error);
  }
}

main(); 