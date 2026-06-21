import { DataTypes, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';
import MuscleGroup from "@/models/musclegroup.model";
import { ModelWithAssociations, ModelWithInitialization, ModelWithTransformation } from "@/types/base.models";
import { addShareCodeToModel } from "@/services/shareCode.service";
import { BodyPartCategoryResponse } from "@/types/DTOs/bodyPartCategory";

// Define the attributes for the Equipment model
interface BodyPartCategoryAttributes {
  id: string;
  name: string;
  description?: string;
  shareCode: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Equipment instance
type BodyPartCategoryCreationAttributes = Optional<BodyPartCategoryAttributes, 'id' | 'shareCode' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

@ModelWithTransformation<BodyPartCategoryResponse>()
@ModelWithAssociations()
@ModelWithInitialization()
export class BodyPartCategory extends Model<BodyPartCategoryAttributes, BodyPartCategoryCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  static prefix = 'BDPC';

  async transform(): Promise<BodyPartCategoryResponse> {
    const response: BodyPartCategoryResponse = {
      id: this.shareCode,
      name: this.name,
    };
    if (this.description) response.description = this.description;
    return response;
  }

  public static associate() {
    BodyPartCategory.hasMany(MuscleGroup, { foreignKey: 'bodyPartCategoryId', onDelete: 'CASCADE' });
  }

  public static initializeModel() {
    BodyPartCategory.init(
      {
        id: {
          type: DataTypes.UUID,
          // Sequelize invokes this function for every new record
          defaultValue: () => uuidv7(),
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        shareCode: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: null,
        }
      },
      {
        sequelize,
        tableName: 'BodyPartCategories',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: {
          beforeCreate: (bodyPartCategory: BodyPartCategory) => {
            addShareCodeToModel(bodyPartCategory, BodyPartCategory.prefix);
          },
          beforeBulkCreate: (bodyPartCategories: BodyPartCategory[]) => {
            // Support bulk operations safely for seeders
            for (const bodyPartCategory of bodyPartCategories) {
              addShareCodeToModel(bodyPartCategory, BodyPartCategory.prefix);
            }
          }
        },
      }
    );
  }
}

BodyPartCategory.initializeModel();

export default BodyPartCategory;