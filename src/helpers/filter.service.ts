import { transformModelArr } from "@/services/util";
import { errAsync, okAsync } from "neverthrow";
import logger from "@/services/logger";
import { Model, ModelStatic } from "sequelize";
import { BaseModelResponse, IModelWithTransformation } from "@/types/base.models";
import { FilterModelResponse } from "@/types/filter.model";
import { ERROR_REASONS } from "@/consts/error-reasons";

export abstract class FilterService {
  abstract className: string;
  abstract model: ModelStatic<Model & IModelWithTransformation<FilterModelResponse>>;

  private cachedResponse: BaseModelResponse[] = [];

  async getAll() {
    if (this.cachedResponse.length > 0) {
      return okAsync(this.cachedResponse);
    }
    try {
      const records = await this.model.findAll({
        order: [['name', 'ASC']], // Order by name in ascending order
      });

      const data = await transformModelArr(records);

      this.cachedResponse = data;
      return okAsync(data);
    } catch (error) {
      logger.error(`${this.className}.getAll: Error fetching records`);
      logger.debug(error);
      return errAsync({
        reason: ERROR_REASONS.INTERNAL_SERVER_ERROR,
        details: error,
      } as const);
    }
  }
}