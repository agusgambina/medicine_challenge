import { Router, Request, Response } from 'express';
import { getProgramById, getAllPrograms } from '../controllers/programsController';
import cache from 'memory-cache';

const router = Router();

const cacheMiddleware = (duration: number) => {
  return (req: Request, res: Response, next: Function) => {
    const key = '__express__' + req.originalUrl || req.url;
    const cachedBody = cache.get(key);

    if (cachedBody) {
      res.send(cachedBody);
      return;
    } else {
      const originalSend = res.send;
      res.send = function(body: any): Response {
        cache.put(key, body, duration * 1000);
        return originalSend.call(this, body);
      };
      next();
    }
  };
};

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Medicine Challenge API!' });
});

router.get('/programs/:programId', cacheMiddleware(300), async (req: Request, res: Response) => {
  await getProgramById(req, res);
});

router.get('/programs', cacheMiddleware(300), async (req: Request, res: Response) => {
  await getAllPrograms(req, res);
});


export default router;