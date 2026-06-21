import { Request, Response } from 'express';
import logger from '@/services/logger';
import { BodyPartCategoryService } from '@/services/bodyPartCategory.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import { BodyPartCategoryResponse } from '@/types/DTOs/bodyPartCategory';

export class BodyPartCategoryController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    const result = await BodyPartCategoryService.getAll();

    result.match(
      async bodyPartCategories => {
        res.json({
          success: true,
          data: bodyPartCategories,
          message: 'BodyPartCategory list fetched successfully',
        } satisfies ApiSuccessResponse<BodyPartCategoryResponse[]>);
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
            logger.error(`Error fetching BodyPartCategory list: ${reason satisfies never}`);
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
    const result = await BodyPartCategoryService.getById(id);

    result.match(
      async bodyPartCategory => {
        res.status(200).json({
          success: true,
          data: bodyPartCategory,
          message: `Successfully retrieved BodyPartCategory with ID ${id}`
        } satisfies ApiSuccessResponse<BodyPartCategoryResponse>);
      },
      error => {
        const reason = error.reason;

        switch (reason) {
          case 'BAD_REQUEST':
            res.status(400).json({
              success: false,
              message: `Invalid BodyPartCategory ID provided`,
            } satisfies ApiErrorResponse<unknown>);
            break;
          case 'NOT_FOUND':
            res.status(404).json({
              success: false,
              message: `BodyPartCategory with ID ${id} not found`,
            } satisfies ApiErrorResponse<unknown>);
            break;
          case 'INTERNAL_SERVER_ERROR':
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse<unknown>);
            break;
          default:
            logger.error(`Error fetching BodyPartCategory by ID: ${reason satisfies never}`);
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse<unknown>);
            break;
        }
      }
    );
  }
}