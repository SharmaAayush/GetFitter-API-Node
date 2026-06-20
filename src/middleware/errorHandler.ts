import type { Request, Response, NextFunction } from 'express';

import config from '@/config/env';

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Received an unhandled error:', error);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: config.NODE_ENV === 'development' ? error.message : 'Internal server error'
    },
    data: null
  });
}