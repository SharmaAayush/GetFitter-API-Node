import { Request, Response } from 'express';
import logger from '@/services/logger';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import { FilterModelResponse } from '@/types/filter.model';
import { FilterService } from '@/helpers/filter.service';

export abstract class FilterController {
  abstract service: FilterService;
  abstract entityName: string;

  async getAll(_req: Request, res: Response): Promise<void> {
    const result = await this.service.getAll();

    result.match(
      async records => {
        res.json({
          success: true,
          message: `${this.entityName} list fetched successfully`,
          data: records,
        } satisfies ApiSuccessResponse<FilterModelResponse[]>);
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
            logger.error(`Error fetching ${this.entityName} list: ${reason satisfies never}`);
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