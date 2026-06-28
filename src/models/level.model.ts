import { Model } from "sequelize";

import sequelize from '@/config/database';
import { BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterCreationAttributes, FilterModelResponse } from "@/types/filter.model";
import { Exercise } from "@/models/exercise.model";

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class Level extends Model<FilterAttributes, FilterCreationAttributes> {
  declare id: string;
  declare name: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  static prefix = 'LVL';

  async transform(): Promise<FilterModelResponse> {
    const response: FilterModelResponse = {
      id: this.shareCode,
      name: this.name,
    };
    return response;
  }

  public static initializeModel() {
    Level.init(
      { ...BaseModelInitAttributes },
      {
        sequelize,
        tableName: 'Levels',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(Level),
      }
    );
  }

  public static associate() {
    Level.hasMany(Exercise, { foreignKey: 'levelId', onDelete: 'CASCADE' });
  }
}

Level.initializeModel();

export default Level;