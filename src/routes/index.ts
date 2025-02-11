import { Router, Request, Response } from 'express';
import { getProgramById } from '../controllers/programsController';

const router = Router();

// Root endpoint
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from Express + TypeScript!' });
});

// Add more routes here as needed
router.get('/programs/:programId', async (req: Request, res: Response) => {
  await getProgramById(req, res);
});

export default router;