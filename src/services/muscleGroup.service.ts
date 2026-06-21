import MuscleGroup from "@/models/musclegroup.model";
import { transformModelArr } from "@/services/util";
import { errAsync, okAsync } from "neverthrow";
import logger from "@/services/logger";
import { decodeShareCodeToUuid } from "./shareCode.service";

export class MuscleGroupService {
  static async getAll() {
    try {
      const muscleGroups = await MuscleGroup.findAll({
        order: [['name', 'ASC']], // Order by name in ascending order
      });

      const data = await transformModelArr(muscleGroups);

      return okAsync(data);
    } catch (error) {
      logger.error('MuscleGroupService.getAll: Error fetching MuscleGroup');
      logger.debug(error);
      return errAsync({
        reason: 'INTERNAL_SERVER_ERROR',
        details: error,
      } as const);
    }
  }

  static async getById(id?: string) {
    try {
      if (!id) {
        logger.warn('MuscleGroupService.getById: No MuscleGroup ID provided');
        return errAsync({
          reason: 'BAD_REQUEST',
          details: 'MuscleGroup ID is required',
        } as const);
      }

      const uuid = decodeShareCodeToUuid(id, MuscleGroup.prefix);
      if (!uuid) {
        logger.warn(`MuscleGroupService.getById: Invalid share code format for ID ${id}`);
        return errAsync({
          reason: 'BAD_REQUEST',
          details: `Invalid share code format for ID ${id}`,
        } as const);
      }

      const bodyPartCategory = await MuscleGroup.findByPk(uuid);

      if (!bodyPartCategory) {
        logger.warn(`MuscleGroupService.getById: MuscleGroup with ID ${id} not found`);

        return errAsync({
          reason: 'NOT_FOUND',
          details: `MuscleGroup with ID ${id} not found`,
        } as const);
      }

      return okAsync(await bodyPartCategory.transform());
    } catch (error) {
      logger.error('MuscleGroupService.getById: Error fetching MuscleGroup');
      logger.debug(error);
      return errAsync({
        reason: 'INTERNAL_SERVER_ERROR',
        details: error,
      } as const);
    }
  }
}