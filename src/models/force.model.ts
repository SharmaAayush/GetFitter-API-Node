import { Model } from "sequelize";

import sequelize from '@/config/database';
import { BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterCreationAttributes, FilterModelResponse } from "@/types/filter.model";
import { Exercise } from "@/models/exercise.model";

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class Force extends Model<FilterAttributes, FilterCreationAttributes> {
  declare id: string;
  declare name: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  static prefix = 'FORC';

  async transform(): Promise<FilterModelResponse> {
    const response: FilterModelResponse = {
      id: this.shareCode,
      name: this.name,
    };
    return response;
  }

  public static initializeModel() {
    Force.init(
      { ...BaseModelInitAttributes, },
      {
        sequelize,
        tableName: 'Forces',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(Force),
      }
    );
  }

  public static associate() {
    Force.hasMany(Exercise, { foreignKey: 'forceId', onDelete: 'CASCADE' })
  }
}

Force.initializeModel();

export default Force;