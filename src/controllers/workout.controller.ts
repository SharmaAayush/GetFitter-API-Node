import { Request, Response } from 'express';
import { WorkoutService } from "@/services/workout.service";
import { CreateWorkoutRequest, WorkoutModelResponse } from '@/types/workout.dto';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import { ERROR_REASONS } from '@/consts/error-reasons';
import logger from "@/services/logger";
import { UserModelResponse } from '@/types/user.dto';

export class WorkoutController {
  service = new WorkoutService();

  async createWorkout(req: CreateWorkoutRequest, res: Response) {
    const currentUser = (req as Request).user as UserModelResponse;
    const result = await this.service.createWorkout(req.body, currentUser);

    result.match(
      message => res.status(201).json({
        success: true,
        data: {
          message: message,
        },
        message: message,
      } satisfies ApiSuccessResponse<{ message: string }>),
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

  async getWorkouts(req: Request, res: Response) {
    const currentUser = req.user as UserModelResponse;
    const result = await this.service.getWorkouts(currentUser);

    result.match(
      data => res.status(200).json({
        success: true,
        data,
        message: 'Workouts fetched successfully',
      } satisfies ApiSuccessResponse<WorkoutModelResponse[]>),
      error => {
        const reason = error.reason;

        switch (reason) {
          case ERROR_REASONS.INTERNAL_SERVER_ERROR:
            res.status(500).json({
              success: false,
              message: 'Internal server error',
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

  async updateWorkout(req: Request, res: Response) {
    const currentUser = req.user as UserModelResponse;
    const workoutId = req.params['id'] as string;
    const result = await this.service.updateWorkout(workoutId, req.body, currentUser);

    result.match(
      data => res.status(200).json({
        success: true,
        data: data!,
        message: 'Workout updated successfully',
      } satisfies ApiSuccessResponse<WorkoutModelResponse>),
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
          case ERROR_REASONS.NOT_FOUND:
            res.status(404).json({
              success: false,
              message: error.details,
            } satisfies ApiErrorResponse);
            break;
          case ERROR_REASONS.FORBIDDEN:
            res.status(403).json({
              success: false,
              message: error.details,
            } satisfies ApiErrorResponse);
            break;
          default:
            logger.error(`Error updating workout: ${reason satisfies never}`);
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