import express, { Express } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { ProgramETL } from './services/ProgramETL';
import { OpenAIService } from './services/OpenAIService';
import { OllamaAIService } from './services/OllamaAIService';
import routes from './routes';
import cache from 'memory-cache';

// Configure dotenv at the start
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Cache middleware
const cacheMiddleware = (duration: number) => {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = cache.get(key);

    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      const originalSend = res.send;
      res.send = function(body: any): express.Response {
        cache.put(key, body, duration * 1000);
        return originalSend.call(this, body);
      };
      next();
    }
  };
};

app.use(express.json());

// Apply cache middleware to all routes (optional)
// app.use(cacheMiddleware(300)); // Cache for 5 minutes

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