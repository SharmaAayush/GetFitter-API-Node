import { QueryInterface, DataTypes } from 'sequelize';
import { uuidv7 } from 'uuidv7';

import { Exercise } from '@/models/exercise.model';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(Exercise.tableName, {
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
      shareCode: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      forceId: {
        type: DataTypes.UUID,
        allowNull: true, // data is incomplete as of now
      },
      levelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      mechanicId: {
        type: DataTypes.UUID,
        allowNull: true, // data is incomplete as of now
      },
      equipmentId: {
        type: DataTypes.UUID,
        allowNull: true, // data is incomplete as of now
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
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

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable(Exercise.tableName);
  }
};