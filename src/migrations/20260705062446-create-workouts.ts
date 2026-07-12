import Level from "@/models/level.model";
import User from "@/models/user.model";
import Workout from "@/models/workout.model";
import { DataTypes, QueryInterface } from "sequelize";
import { uuidv7 } from "uuidv7";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(
      Workout.tableName,
      {
        id: {
          type: DataTypes.UUID,
          // Sequelize invokes this function for every new record
          defaultValue: () => uuidv7(),
          allowNull: false,
          primaryKey: true,
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
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: User.tableName,
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        levelId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: Level.tableName,
            key: "id",
          },
          onDelete: "CASCADE",
          onUpdate: "CASCADE",
        },
        estimatedDuration: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      }
    );
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable(Workout.tableName);
  }
};