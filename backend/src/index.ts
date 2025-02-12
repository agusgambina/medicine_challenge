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

interface AIServiceConfig {
  type: 'ollama' | 'openai';
  apiKey?: string;
  url?: string;
}

function setupServer(): Express {
  const app: Express = express();
  const port = process.env.PORT || 3000;

  // Configure CORS
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use('/', routes);

  // Start server only if not running ETL command
  if (!process.argv.includes('etl')) {
    app.listen(port, () => {
      console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    });
  }

  return app;
}

function createAIService(config: AIServiceConfig) {
  if (config.type === 'openai') {
    if (!config.apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required for OpenAI service');
    }
    return new OpenAIService(config.apiKey);
  } else {
    if (!config.url) {
      throw new Error('OLLAMA_URL environment variable is required for Ollama service');
    }
    return new OllamaAIService(config.url);
  }
}

async function getJSONFiles(directory: string): Promise<string[]> {
  const files = await fs.readdir(directory);
  return files.filter(file => file.endsWith('.json'));
}

async function processProgram(etl: ProgramETL, inputPath: string, outputPath: string, programName: string) {
  try {
    console.log(`Processing ${programName}...`);
    
    await etl.extract(inputPath);
    const transformedData = await etl.transform();
    await etl.load(outputPath, transformedData);
    
    console.log(`Successfully processed ${programName}`);
  } catch (error) {
    console.error(`Error processing ${programName}:`, error);
    throw error;
  }
}

async function runETLProcess() {
  try {
    const aiServiceType = process.argv[4]?.toLowerCase() || 'ollama';
    
    if (!['ollama', 'openai'].includes(aiServiceType)) {
      throw new Error('Usage: yarn etl <ollama|openai>');
    }

    const aiConfig: AIServiceConfig = {
      type: aiServiceType as 'ollama' | 'openai',
      apiKey: process.env.OPENAI_API_KEY,
      url: process.env.OLLAMA_URL
    };

    const aiService = createAIService(aiConfig);
    const etl = new ProgramETL(aiService);
    
    const dataDir = path.join(__dirname, '../data');
    const jsonFiles = await getJSONFiles(dataDir);
    
    console.log(`Found ${jsonFiles.length} JSON files to process`);

    for (const file of jsonFiles) {
      const programName = path.basename(file, '.json');
      const inputPath = path.join(dataDir, file);
      const outputPath = path.join(__dirname, `../output_data/${programName}-transformed.json`);
      
      try {
        await processProgram(etl, inputPath, outputPath, programName);
      } catch (error) {
        // Continue with next file even if one fails
        continue;
      }
    }

    console.log('ETL process completed successfully for all files');
  } catch (error) {
    console.error('ETL process failed:', error);
    process.exit(1);
  }
}

// Initialize application
setupServer();

// Run ETL process if requested
if (process.argv.includes('etl')) {
  console.log('Running ETL process...');
  runETLProcess();
} 