import { Router, Request, Response } from 'express';
import config from '@/config/env';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: config.NODE_ENV
    },
    message: 'Server is running successfully'
  });
});

export default router;