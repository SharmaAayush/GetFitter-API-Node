import { DataTypes, QueryInterface } from "sequelize";
import { uuidv7 } from "uuidv7";

import BodyPartCategory from "@/models/bodypartcategory.model";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(BodyPartCategory.tableName, {
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
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable(BodyPartCategory.tableName);
  }
};