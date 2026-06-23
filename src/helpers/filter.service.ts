import { transformModelArr } from "@/services/util";
import { errAsync, okAsync } from "neverthrow";
import logger from "@/services/logger";
import { Model, ModelStatic } from "sequelize";
import { IModelWithTransformation } from "../types/base.models";
import { FilterModelResponse } from "../types/filter.model";

export abstract class FilterService {
  abstract className: string;
  abstract model: ModelStatic<Model & IModelWithTransformation<FilterModelResponse>>;

  async getAll() {
    try {
      const records = await this.model.findAll({
        order: [['name', 'ASC']], // Order by name in ascending order
      });

      const data = await transformModelArr(records);

      return okAsync(data);
    } catch (error) {
      logger.error(`${this.className}.getAll: Error fetching records`);
      logger.debug(error);
      return errAsync({
        reason: 'INTERNAL_SERVER_ERROR',
        details: error,
      } as const);
    }
  }
}