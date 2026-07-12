import { Request, Response } from 'express';
import { WorkoutService } from "@/services/workout.service";
import { CreateWorkoutRequest } from '@/types/workout.dto';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import { ERROR_REASONS } from '@/consts/error-reasons';
import logger from "@/services/logger";
import User from '@/models/user.model';

export class WorkoutController {
  service = new WorkoutService();

  async createWorkout(req: CreateWorkoutRequest, res: Response) {
    const currentUser = (req as Request).user as User;
    const result = await this.service.createWorkout(req.body, currentUser);

    result.match(
      success => res.status(201).json({
        success: true,
        data: {
          message: success.message,
        },
        message: success.message,
      } satisfies ApiSuccessResponse<{message: string}>),
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
            logger.error(`Error fetching Exercise list: ${reason satisfies never}`);
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse);
            break;
        }
      }
    )
  }
}