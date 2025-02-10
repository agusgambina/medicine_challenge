import express, { Express, Request, Response } from 'express';
import path from 'path';
import { DupixentETL } from './services/DupixentETL';

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
    const etl = new DupixentETL();
    
    // Extract
    await etl.extract(path.join(__dirname, '../data/dupixent.json'));
    
    // Transform
    const transformedData = etl.transform();
    
    // Load
    await etl.load(
      path.join(__dirname, '../data/dupixent-transformed.json'),
      transformedData
    );

    console.log('ETL process completed successfully');
    console.log('Transformed data summary:', {
      program_name: transformedData.programInfo.program_name,
      coverage_eligibilities: transformedData.programInfo.coverage_eligibilities,
      program_type: transformedData.programInfo.program_type,

    });

  } catch (error) {
    console.error('ETL process failed:', error);
  }
}

main(); 