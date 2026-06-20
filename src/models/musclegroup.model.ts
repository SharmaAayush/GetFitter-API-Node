import { DataTypes, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';
import BodyPartCategory from "@/models/bodypartcategory.model";
import { ModelWithAssociations, ModelWithInitialization } from "@/types/base.models";

// Define the attributes for the Equipment model
export interface MuscleGroupAttributes {
  id: string;
  name: string;
  description?: string;
  bodyPartCategoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Equipment instance
export type MuscleGroupCreationAttributes = Optional<MuscleGroupAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

@ModelWithAssociations()
@ModelWithInitialization()
export class MuscleGroup extends Model<MuscleGroupAttributes, MuscleGroupCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare bodyPartCategoryId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

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
      }
    );
  }
}

export default MuscleGroup;