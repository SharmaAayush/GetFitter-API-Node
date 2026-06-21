import { DataTypes, HasOneGetAssociationMixin, Model, NonAttribute, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';
import BodyPartCategory from "@/models/bodypartcategory.model";
import { ModelWithAssociations, ModelWithInitialization, ModelWithTransformation } from "@/types/base.models";
import { addShareCodeToModel } from "@/services/shareCode.service";
import { MuscleGroupResponse } from "@/types/DTOs/muscleGroup";

// Define the attributes for the Equipment model
export interface MuscleGroupAttributes {
  id: string;
  name: string;
  description?: string;
  shareCode: string;
  bodyPartCategoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Equipment instance
export type MuscleGroupCreationAttributes = Optional<MuscleGroupAttributes, 'id' | 'shareCode' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

@ModelWithTransformation<MuscleGroupResponse>()
@ModelWithAssociations()
@ModelWithInitialization()
export class MuscleGroup extends Model<MuscleGroupAttributes, MuscleGroupCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare shareCode: string;
  declare bodyPartCategoryId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  static prefix = 'TARG';

  // 1. Declare the association property for eager loading
  // Use NonAttribute to tell Sequelize this is not a database column
  declare BodyPartCategory?: NonAttribute<BodyPartCategory>;

  // 2. Declare the mixin getter for lazy loading fallback
  declare getBodyPartCategory: HasOneGetAssociationMixin<BodyPartCategory>;

  async transform(): Promise<MuscleGroupResponse> {
    const response: MuscleGroupResponse = {
      id: this.shareCode,
      name: this.name,
      bodyPartCategory: {
        id: '',
        name: '',
      },
    }
    if (this.description) response.description = this.description;

    // Fallback logic: Use eager loaded data, or fall back to lazy loading
    let category = this.BodyPartCategory;
    if (!category) {
      category = await this.getBodyPartCategory();
    }
    if (category) {
      response.bodyPartCategory = {
        id: category.shareCode,
        name: category.name,
      }
    }
    return response;
  }

  public static associate() {
    MuscleGroup.belongsTo(BodyPartCategory, { foreignKey: 'bodyPartCategoryId', onDelete: 'CASCADE' });
  }

  public static initializeModel() {
    MuscleGroup.init(
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
        bodyPartCategoryId: {
          type: DataTypes.UUID,
          allowNull: false,
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
        tableName: 'MuscleGroups',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: {
          beforeCreate: (muscleGroup: MuscleGroup) => {
            addShareCodeToModel(muscleGroup, MuscleGroup.prefix);
          },
          beforeBulkCreate: (muscleGroups: MuscleGroup[]) => {
            // Support bulk operations safely for seeders
            for (const muscleGroup of muscleGroups) {
              addShareCodeToModel(muscleGroup, MuscleGroup.prefix);
            }
          }
        },
      }
    );
  }
}

MuscleGroup.initializeModel();

export default MuscleGroup;