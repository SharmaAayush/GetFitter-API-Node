import { ExerciseService } from '@/services/exercise.service';
import logger from '@/services/logger';
import { ExerciseModelResponse, GetExercisesQuery } from '@/types/exercise.dto';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import { Request, Response } from 'express';

export class ExerciseController {
  service = new ExerciseService();

  async getExercises(req: Request<unknown, unknown, unknown, GetExercisesQuery>, res: Response) {
    const result = await this.service.getExercises(req.query);

    result.match(
      async data => {
        res.json({
          success: true,
          data: data.data,
          message: `Exercise list fetched successfully`,
          meta: data.meta,
        } satisfies ApiSuccessResponse<ExerciseModelResponse[], Record<string, number>>)
      },
      error => {
        const reason = error.reason;

        switch (reason) {
          case 'INTERNAL_SERVER_ERROR':
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse);
            break;
          case 'BAD_REQUEST':
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
    );
  }
}