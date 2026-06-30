import { Request, Response } from 'express';
import { CategoryService } from "@/services/category.service";
import { EquipmentService } from "@/services/equipment.service";
import { ForceService } from "@/services/force.service";
import { LevelService } from "@/services/level.service";
import { MechanicService } from "@/services/mechanic.service";
import { MuscleGroupService } from "@/services/muscleGroup.service";
import { Result } from 'neverthrow';
import { ERROR_REASONS } from '@/consts/error-reasons';
import { ApiErrorResponse, ApiSuccessResponse } from '@/types/response';
import logger from '@/services/logger';
import { BaseModelResponse } from '@/types/base.models';

export class FiltersController {
  private categoryService = new CategoryService();
  private equipmentService = new EquipmentService();
  private forceService = new ForceService();
  private levelService = new LevelService();
  private mechanicService = new MechanicService();
  private muscleGroupService = new MuscleGroupService();

  async getFilters(_req: Request, res: Response) {
    const promises = [
      this.categoryService.getAll(),
      this.equipmentService.getAll(),
      this.forceService.getAll(),
      this.levelService.getAll(),
      this.mechanicService.getAll(),
      this.muscleGroupService.getAll(),
    ];
    const results = await Promise.all(promises);

    const result = Result.combine(results).map(([
      categoryRes,
      equipmentRes,
      forceRes,
      levelRes,
      mechanicRes,
      muscleGroupRes,
    ]) => ({
      categories: categoryRes,
      equipments: equipmentRes,
      forces: forceRes,
      levels: levelRes,
      mechanics: mechanicRes,
      muscleGroups: muscleGroupRes,
    }));

    result.match(
      records => {
        res.json({
          success: true,
          message: `Filter list fetched successfully`,
          data: records,
        } satisfies ApiSuccessResponse<Record<string, BaseModelResponse[] | undefined>>);
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
          default:
            logger.error(`Error fetching Filter list: ${reason satisfies never}`);
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