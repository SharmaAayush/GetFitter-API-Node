import BodyPartCategory from "@/models/bodypartcategory.model";
import logger from "@/services/logger";
import { errAsync, okAsync } from "neverthrow";
import { transformModelArr } from "@/services/util";
import { decodeShareCodeToUuid } from "./shareCode.service";

export class BodyPartCategoryService {
  static async getAll() {
    try {
      const bodyPartCategories = await BodyPartCategory.findAll({
        order: [['name', 'ASC']], // Order by name in ascending order
      });

      const data = await transformModelArr(bodyPartCategories);

      return okAsync(data);
    } catch (error) {
      logger.error('BodyPartCategoryService.getAll: Error fetching BodyPartCategories');
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
        logger.warn('BodyPartCategoryService.getById: No BodyPartCategory ID provided');
        return errAsync({
          reason: 'BAD_REQUEST',
          details: 'BodyPartCategory ID is required',
        } as const);
      }

      const uuid = decodeShareCodeToUuid(id, BodyPartCategory.prefix);
      if (!uuid) {
        logger.warn(`BodyPartCategoryService.getById: Invalid share code format for ID ${id}`);
        return errAsync({
          reason: 'BAD_REQUEST',
          details: `Invalid share code format for ID ${id}`,
        } as const);
      }

      const bodyPartCategory = await BodyPartCategory.findByPk(id);

      if (!bodyPartCategory) {
        logger.warn(`BodyPartCategoryService.getById: BodyPartCategory with ID ${id} not found`);

        return errAsync({
          reason: 'NOT_FOUND',
          details: `BodyPartCategory with ID ${id} not found`,
        } as const);
      }

      return okAsync(await bodyPartCategory.transform());
    } catch (error) {
      logger.error('BodyPartCategoryService.getById: Error fetching BodyPartCategory');
      logger.debug(error);
      return errAsync({
        reason: 'INTERNAL_SERVER_ERROR',
        details: error,
      } as const);
    }
  }
}