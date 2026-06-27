import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import passport from '@/config/passport';
import env from '@/config/env';
import { ERROR_REASONS } from '@/consts/error-reasons';
import logger from '@/services/logger';
import { UserService } from '@/services/user.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import { UserModelResponse, UserRegisterRequest } from '@/types/user.dto';

export class UserController {
  service = new UserService();

  async registerUser(req: Request<unknown, unknown, UserRegisterRequest>, res: Response) {
    const result = await this.service.registerUser(req.body);

    result.match(
      async data => {
        res.json({
          success: true,
          data,
          message: 'User registered successfully',
        } satisfies ApiSuccessResponse<UserModelResponse>)
      },
      error => {
        const reason = error.reason;

        switch (reason) {
          case ERROR_REASONS.INTERNAL_SERVER_ERROR:
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse);
            break;
          case ERROR_REASONS.BAD_REQUEST:
            res.status(400).json({
              success: false,
              message: error.details,
            } satisfies ApiErrorResponse);
            break;
          default:
            logger.error(`Error registering user: ${reason satisfies never}`);
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse);
            break;
        }
      }
    )
  }

  async loginUser(req: Request<unknown, unknown, UserRegisterRequest>, res: Response, _next: NextFunction) {
    passport.authenticate('local', { session: false }, (err: unknown, user: UserModelResponse) => {
      if (err) {
        return _next(err);
      }
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials'
        } satisfies ApiErrorResponse);
      }

      const jwtToken = jwt.sign({ ...user }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRATION_TIME });
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { token: jwtToken }
      } satisfies ApiSuccessResponse<{ token: string }>);
    })(req, res, _next);
  }
}