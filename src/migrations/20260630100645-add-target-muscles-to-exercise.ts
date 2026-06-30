import { DataTypes, QueryInterface } from "sequelize";
import exerciseData from '../../submodules/free-exercise-db/dist/exercises.json';
import Exercise from "@/models/exercise.model";
import MuscleGroup from "@/models/musclegroup.model";

module.exports = {
  async up(queryInterface: QueryInterface) {
    // 1. Add the column
    await queryInterface.addColumn(Exercise.tableName, 'targetMuscleId', DataTypes.UUID);
    // 2. Fill the column
    for (const exercise of exerciseData) {
      if (exercise.primaryMuscles.length === 1) {
        const primaryMuscle = exercise.primaryMuscles[0];
        const primaryMuscleRecord = await MuscleGroup.findOne({ where: { name: primaryMuscle } });
        if (primaryMuscleRecord) {
          const primaryMuscleId = primaryMuscleRecord.id;
          await queryInterface.sequelize.query(
            `UPDATE "${Exercise.tableName}" SET "targetMuscleId" = :primaryMuscleId WHERE slug = :slug`,
            {
              replacements: {
                primaryMuscleId,
                slug: exercise.id,
              }
            }
          )
        }
      }
    }
    // 3. Make column non-nullable
    await queryInterface.changeColumn(Exercise.tableName, 'targetMuscleId', { type: DataTypes.UUID, allowNull: false });
    // 4. Add foreign key constraint
    await queryInterface.addConstraint(Exercise.tableName, {
      fields: ['targetMuscleId'],
      type: 'foreign key',
      name: 'fk_exercises_target_muscle_id',
      references: {
        table: MuscleGroup.tableName,
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('exercises', 'targetMuscleId');
  }
};
