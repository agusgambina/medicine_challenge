import express, { Express } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors';
import { ProgramETL } from './services/ProgramETL';
import { OpenAIService } from './services/OpenAIService';
import { OllamaAIService } from './services/OllamaAIService';
import routes from './routes';
import fs from 'fs/promises';

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

// Start server only if not running ETL command
if (!process.argv.includes('etl')) {
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
}

async function main() {
  try {
    // Get AI service type from command line arguments (skip first two args from ts-node)
    const aiService = process.argv[4]?.toLowerCase() || 'ollama';
    
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
    
    // Read all JSON files from the data directory
    const dataDir = path.join(__dirname, '../data');
    const files = await fs.readdir(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    console.log(`Found ${jsonFiles.length} JSON files to process`);

    // Process each JSON file
    for (const file of jsonFiles) {
      const programName = path.basename(file, '.json');
      console.log(`Processing ${programName}...`);

      try {
        // Extract
        await etl.extract(path.join(dataDir, file));
        
        // Transform
        const transformedData = await etl.transform();
        
        // Load
        await etl.load(
          path.join(__dirname, `../output_data/${programName}-transformed.json`),
          transformedData
        );

        console.log(`Successfully processed ${programName}`);
      } catch (error) {
        console.error(`Error processing ${programName}:`, error);
        // Continue with next file even if one fails
        continue;
      }
    }

    console.log('ETL process completed successfully for all files');

  } catch (error) {
    console.error('ETL process failed:', error);
  }
}


if (process.argv.includes('etl')) {
  console.log('Running ETL process...');
  main();
  console.log('ETL process completed successfully');
} 