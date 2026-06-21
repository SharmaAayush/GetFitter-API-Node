import { DataTypes, QueryInterface } from "sequelize";
import { uuidv7 } from "uuidv7";

import MuscleGroup from "@/models/musclegroup.model";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(MuscleGroup.tableName, {
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
    await queryInterface.dropTable(MuscleGroup.tableName);
  }
};