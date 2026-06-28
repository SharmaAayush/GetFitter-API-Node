import { Model } from "sequelize";

import sequelize from '@/config/database';
import { BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterCreationAttributes, FilterModelResponse } from "@/types/filter.model";
import { Exercise } from "@/models/exercise.model";

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class Category extends Model<FilterAttributes, FilterCreationAttributes> {
  declare id: string;
  declare name: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  static prefix = 'CATG';

  async transform(): Promise<FilterModelResponse> {
    const response: FilterModelResponse = {
      id: this.shareCode,
      name: this.name,
    };
    return response;
  }

  public static initializeModel() {

    Category.init(
      { ...BaseModelInitAttributes },
      {
        sequelize,
        tableName: 'Categories',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(Category),
      }
    );
  }

  public static associate() {
    Category.hasMany(Exercise, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
  }
}

Category.initializeModel();

export default Category;
