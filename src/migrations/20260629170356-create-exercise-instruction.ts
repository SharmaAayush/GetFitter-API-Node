import ExerciseInstruction from "@/models/exercise-instruction";
import { CreatedAtAttribute, DeletedAtAttribute, IdAttribute, ShareCodeAttribute, UpdatedAtAttribute } from "@/types/base.models";
import { 
  DataTypes,
  QueryInterface
} from "sequelize";
import exerciseData from '../../submodules/free-exercise-db/dist/exercises.json';
import { uuidv7 } from "uuidv7";
import Exercise from "@/models/exercise.model";
import { encodeUuidToShareCode } from "@/services/shareCode.service";

module.exports = {
  async up(queryInterface: QueryInterface) {
    // Create table
    await queryInterface.createTable(ExerciseInstruction.tableName, {
      id: IdAttribute,
      instruction: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      exerciseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      shareCode: ShareCodeAttribute,
      createdAt: CreatedAtAttribute,
      updatedAt: UpdatedAtAttribute,
      deletedAt: DeletedAtAttribute,
    });

    // Foreign key constraint
    await queryInterface.addConstraint(ExerciseInstruction.tableName, {
      fields: ['exerciseId'],
      type: 'foreign key',
      name: 'fk_exercise_instructions_exercises',
      references: {
        table: 'Exercises', // Name of your actual target table
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });

    // Unique constraint for order and exerciseId combination
    await queryInterface.addConstraint(ExerciseInstruction.tableName, {
      fields: ['exerciseId', 'order'],
      type: 'unique',
      name: 'unique_exercise_order',
    });

    for (const exercise of exerciseData) {
      const [records] = await queryInterface.sequelize.query(
        `SELECT id FROM "Exercises" WHERE slug = :slug LIMIT 1;`,
        { replacements: { slug: exercise.id } }
      );
      const exerciseRows = records as Exercise[];

      if (exerciseRows.length > 0) {
        const actualExerciseId = (exerciseRows[0] as Exercise).id;

        for (let i = 0; i < exercise.instructions.length; i++) {
          const instructionText = exercise.instructions[i];
          const displayOrder = i + 1;
          const uniqueId = uuidv7();

          const shareCode = encodeUuidToShareCode(uniqueId, ExerciseInstruction.prefix);

          await queryInterface.sequelize.query(
            `INSERT INTO "${ExerciseInstruction.tableName}" 
              (id, instruction, "exerciseId", "order", "shareCode", "createdAt", "updatedAt") 
             VALUES 
              (:id, :instruction, :exerciseId, :order, :shareCode, NOW(), NOW());`,
            {
              replacements: {
                id: uniqueId,
                instruction: instructionText,
                exerciseId: actualExerciseId,
                order: displayOrder,
                shareCode: shareCode
              }
            }
          );
        }
      }
    }
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable(ExerciseInstruction.tableName);
  }
};