import WeightUnit from "@/models/weightunits.model";
import WorkoutExercise from "@/models/workoutexercise.model";
import WorkoutExerciseSet from "@/models/workoutexerciseset.model";
import { DataTypes, QueryInterface } from "sequelize";
import { uuidv7 } from "uuidv7";

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(
      WorkoutExerciseSet.tableName,
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
        workoutExerciseId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: WorkoutExercise.tableName,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        setNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        reps: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        weight: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        weightUnitId: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: WeightUnit.tableName,
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
      }
    );

    await queryInterface.addIndex(
      WorkoutExerciseSet.tableName,
      ["workoutExerciseId", "setNumber"],
      {
        unique: true,
        name: 'WKST_UNIQUE_WORKOUT_EXERCISE_SET',
      },
    );
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable(WorkoutExerciseSet.tableName);
  }
};