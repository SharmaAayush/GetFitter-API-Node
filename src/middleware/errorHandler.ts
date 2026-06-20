import type { Request, Response } from 'express';

import config from '@/config/env';
import logger from '@/services/logger';

export const errorHandler = (error: Error, _req: Request, res: Response) => {
  logger.error('Received an unhandled error:', error);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.NODE_ENV === 'development' ? error.message : 'Internal server error'
    },
    data: null
  });
}