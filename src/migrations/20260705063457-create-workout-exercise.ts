import Exercise from "@/models/exercise.model";
import Workout from "@/models/workout.model";
import WorkoutExercise from "@/models/workoutexercise.model";
import { DataTypes, QueryInterface } from "sequelize";
import { uuidv7 } from "uuidv7";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(
      WorkoutExercise.tableName,
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
        workoutId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: Workout.tableName,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        exerciseId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: Exercise.tableName,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        orderIndex: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      }
    );

    await queryInterface.addIndex(
      WorkoutExercise.tableName,
      ["workoutId", "orderIndex"],
      {
        unique: true,
        name: "WKEX_UNIQUE_WORKOUT_EXERCISE_ORDER_INDEX",
      }
    )
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable(WorkoutExercise.tableName);
  }
};