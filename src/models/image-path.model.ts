import { DataTypes, Model, Optional } from "sequelize";

import sequelize from '@/config/database';
import { BaseModelCreationExcludedAttributes, BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterModelResponse } from "@/types/filter.model";
import Exercise from "./exercise.model";

export interface ImagePathAttributes extends FilterAttributes {
  exerciseId: string;
}

export type ImagePathCreationAttributes = Optional<ImagePathAttributes, BaseModelCreationExcludedAttributes | 'exerciseId'>

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class ImagePath extends Model<ImagePathAttributes, ImagePathCreationAttributes> {
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
      {
        ...BaseModelInitAttributes,
        exerciseId: {
          type: DataTypes.UUID,
          allowNull: false,
        }
      },
      {
        sequelize,
        tableName: 'ImagePaths',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(ImagePath),
      }
    );
  }

  public static associate() {
    ImagePath.belongsTo(Exercise, { foreignKey: 'exerciseId', onDelete: 'CASCADE' });
  }
}

ImagePath.initializeModel();

export default ImagePath;