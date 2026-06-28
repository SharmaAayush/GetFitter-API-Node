import { Model } from "sequelize";

import sequelize from '@/config/database';
import { BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterCreationAttributes, FilterModelResponse } from "@/types/filter.model";

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
export class ImagePath extends Model<FilterAttributes, FilterCreationAttributes> {
  declare id: string;
  declare name: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  static prefix = 'IMGP';

  async transform(): Promise<FilterModelResponse> {
    const response: FilterModelResponse = {
      id: this.shareCode,
      name: this.name,
    };
    return response;
  }

  public static initializeModel() {
    ImagePath.init(
      { ...BaseModelInitAttributes },
      {
        sequelize,
        tableName: 'ImagePaths',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(ImagePath),
      }
    );
  }
}

ImagePath.initializeModel();

export default ImagePath;