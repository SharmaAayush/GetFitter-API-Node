import Exercise from "@/models/exercise.model";
import MuscleGroup from "@/models/musclegroup.model";
import { DataTypes, QueryInterface } from "sequelize";
import exerciseData from '../../submodules/free-exercise-db/dist/exercises.json';

module.exports = {
  async up(queryInterface: QueryInterface) {
    // 1. Create table
    await queryInterface.createTable('ExerciseSecondaryMuscles', {
      exerciseId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: Exercise.tableName,
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      },
      muscleGroupId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: MuscleGroup.tableName,
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        primaryKey: true,
      },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
    });
    // 2. Fill the table
    for (const exercise of exerciseData) {
      if (!exercise.secondaryMuscles || exercise.secondaryMuscles.length === 0) {
        continue;
      }
      const [records] = await queryInterface.sequelize.query(
        `SELECT id FROM "${Exercise.tableName}" WHERE slug = :slug LIMIT 1;`,
        { replacements: { slug: exercise.id } }
      );
      const exerciseRows = records as Exercise[];

      if (exerciseRows.length > 0) {
        const actualExerciseId = (exerciseRows[0] as Exercise).id;

        for (const muscleName of exercise.secondaryMuscles) {
          const [muscleRecords] = await queryInterface.sequelize.query(
            `SELECT id FROM "${MuscleGroup.tableName}" WHERE name ILIKE :name LIMIT 1;`,
            { replacements: { name: muscleName } }
          );
          const muscleRows = muscleRecords as MuscleGroup[];
          if (muscleRows.length > 0) {
            const actualMuscleGroupId = (muscleRows[0] as MuscleGroup).id;

            await queryInterface.sequelize.query(
              `INSERT INTO "ExerciseSecondaryMuscles" ("exerciseId", "muscleGroupId", "createdAt", "updatedAt")
               VALUES (:exerciseId, :muscleGroupId, NOW(), NOW())
               ON CONFLICT ("exerciseId", "muscleGroupId") DO NOTHING;`,
              {
                replacements: {
                  exerciseId: actualExerciseId,
                  muscleGroupId: actualMuscleGroupId
                }
              }
            );
          }
        }
      }
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('ExerciseSecondaryMuscles');
  }
};
