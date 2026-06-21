import { Request, Response } from 'express';
import logger from '@/services/logger';
import { MuscleGroupService } from '@/services/muscleGroup.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import { MuscleGroupResponse } from '@/types/DTOs/muscleGroup';

export class MuscleGroupController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    const result = await MuscleGroupService.getAll();

    result.match(
      async muscleGroups => {
        res.json({
          success: true,
          data: muscleGroups,
          message: 'MuscleGroup list fetched successfully',
        } satisfies ApiSuccessResponse<MuscleGroupResponse[]>);
      },
      error => {
        const reason = error.reason;

        switch (reason) {
          case 'INTERNAL_SERVER_ERROR':
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse<unknown>);
            break;
          default:
            logger.error(`Error fetching MuscleGroup list: ${reason satisfies never}`);
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse<unknown>);
            break;
        }
      }
    );
  }

  static async getById(req: Request<{ id?: string }>, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await MuscleGroupService.getById(id);

    result.match(
      async muscleGroup => {
        res.status(200).json({
          success: true,
          data: muscleGroup,
          message: `Successfully retrieved MuscleGroup with ID ${id}`
        } satisfies ApiSuccessResponse<MuscleGroupResponse>);
      },
      error => {
        const reason = error.reason;

        switch (reason) {
          case 'BAD_REQUEST':
            res.status(400).json({
              success: false,
              message: `Invalid MuscleGroup ID provided`,
            } satisfies ApiErrorResponse<unknown>);
            break;
          case 'NOT_FOUND':
            res.status(404).json({
              success: false,
              message: `MuscleGroup with ID ${id} not found`,
            } satisfies ApiErrorResponse<unknown>);
            break;
          case 'INTERNAL_SERVER_ERROR':
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse<unknown>);
            break;
          default:
            logger.error(`Error fetching MuscleGroup by ID: ${reason satisfies never}`);
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse<unknown>);
            break;
        }
      }
    )
  }
}