import { DataTypes, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database';

// Define the attributes for the Equipment model
interface BodyPartCategoryAttributes {
  id: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Equipment instance
type BodyPartCategoryCreationAttributes = Optional<BodyPartCategoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export class BodyPartCategory extends Model<BodyPartCategoryAttributes, BodyPartCategoryCreationAttributes> {
  declare id: string;
  declare name: string;
  declare description?: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}

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
  }
);

export default BodyPartCategory;