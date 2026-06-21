import { Request, Response } from 'express';
import logger from '@/services/logger';
import { EquipmentService } from '@/services/equipment.service';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import { EquipmentResponse } from '@/types/DTOs/equipment';

export class EquipmentController {
  static async getAll(_req: Request, res: Response): Promise<void> {
    const result = await EquipmentService.getAll();

    result.match(
      async equipments => {
        res.json({
          success: true,
          message: 'Equipment list fetched successfully',
          data: equipments,
        } satisfies ApiSuccessResponse<EquipmentResponse[]>);
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
            logger.error(`Error fetching Equipment list: ${reason satisfies never}`);
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
    const result = await EquipmentService.getById(id);

    result.match(
      async equipment => {
        res.status(200).json({
          success: true,
          data: equipment,
          message: `Successfully retrieved Equipment with ID ${id}`
        } satisfies ApiSuccessResponse<EquipmentResponse>);
      },
      error => {
        const reason = error.reason;

        switch (reason) {
          case 'BAD_REQUEST':
            res.status(400).json({
              success: false,
              message: `Invalid Equipment ID provided`,
            } satisfies ApiErrorResponse<unknown>);
            break;
          case 'NOT_FOUND':
            res.status(404).json({
              success: false,
              message: `Equipment with ID ${id} not found`,
            } satisfies ApiErrorResponse<unknown>);
            break;
          case 'INTERNAL_SERVER_ERROR':
            res.status(500).json({
              success: false,
              message: 'Internal server error',
            } satisfies ApiErrorResponse<unknown>);
            break;
          default:
            logger.error(`Error fetching Equipment by ID: ${reason satisfies never}`);
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