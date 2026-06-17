import { QueryInterface, DataTypes } from 'sequelize';
import { uuidv7 } from 'uuidv7';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable('Equipments', {
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
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    await queryInterface.dropTable('Equipments');
  }
};