import type { NextFunction, Request, Response } from 'express';

import config from '@/config/env';
import logger from '@/services/logger';
import { ERROR_REASONS } from '@/consts/error-reasons';

export const errorHandler = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Received an unhandled error:', error);

  res.status(500).json({
    success: false,
    error: {
      code: ERROR_REASONS.INTERNAL_SERVER_ERROR,
      message: config.NODE_ENV === 'development' ? error.message : 'Internal server error'
    },
    data: null
  });
}