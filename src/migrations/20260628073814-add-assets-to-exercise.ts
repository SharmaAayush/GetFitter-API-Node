import ImagePath from '@/models/image-path.model';
import { DataTypes, QueryInterface } from 'sequelize';
import exerciseData from '../../submodules/free-exercise-db/dist/exercises.json';
import Exercise from '@/models/exercise.model';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    // 1. Add the column allowing null values temporarily
    await queryInterface.addColumn(ImagePath.tableName, 'exerciseId', {
      type: DataTypes.UUID,
      allowNull: true,
    });

    // 2. Loop through your JSON array and update using a single query per exercise
    for (const exercise of exerciseData) {
      for (const imagePath of exercise.images) {
        await queryInterface.sequelize.query(
          `UPDATE "${ImagePath.tableName}"
           SET "exerciseId" = e.id
           FROM "${Exercise.tableName}" e
           WHERE e.slug = :slug
           AND "${ImagePath.tableName}".name = :imagePath`,
          {
            replacements: {
              slug: exercise.id,
              imagePath: imagePath,
            }
          }
        )
      }
    }

    // 3. Change the column to NOT NULL now that it is fully populated
    await queryInterface.changeColumn(ImagePath.tableName, 'exerciseId', {
      type: DataTypes.UUID,
      allowNull: false,
    });

    // 4. Add a foreign key constraint to the exerciseId column in ImagePaths.
    await queryInterface.addConstraint(ImagePath.tableName, {
      fields: ['exerciseId'],
      type: 'foreign key',
      name: 'fk_image_paths_exercises',
      references: {
        table: Exercise.tableName,
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn(ImagePath.tableName, 'exerciseId');
  }
};