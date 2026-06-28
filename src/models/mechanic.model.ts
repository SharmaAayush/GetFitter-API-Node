import { Model } from "sequelize";

import sequelize from '@/config/database';
import { BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterCreationAttributes, FilterModelResponse } from "@/types/filter.model";
import { Exercise } from "@/models/exercise.model";

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class Mechanic extends Model<FilterAttributes, FilterCreationAttributes> {
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
    Mechanic.init(
      { ...BaseModelInitAttributes },
      {
        sequelize,
        tableName: 'Mechanics',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(Mechanic),
      }
    );
  }

  public static associate() {
    Mechanic.hasMany(Exercise, { foreignKey: 'mechanicId', onDelete: 'CASCADE' });
  }
}

Mechanic.initializeModel();

export default Mechanic;