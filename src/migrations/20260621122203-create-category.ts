import { QueryInterface, DataTypes } from 'sequelize';
import { uuidv7 } from 'uuidv7';

import Category from '@/models/category';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(Category.tableName, {
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
    await queryInterface.dropTable(Category.tableName);
  }
};