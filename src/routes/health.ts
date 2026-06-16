import { Router } from 'express';
import config from '@/config/env';

const router = Router();

router.get('/', (req, res) => {
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