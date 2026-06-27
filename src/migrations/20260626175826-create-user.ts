import { QueryInterface, DataTypes } from 'sequelize';
import { uuidv7 } from 'uuidv7';

import { User } from '@/models/user.model';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable(User.tableName, {
      id: {
        type: DataTypes.UUID,
        // Sequelize invokes this function for every new record
        defaultValue: () => uuidv7(),
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false, // make it nullable later for SSO logins
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
    await queryInterface.dropTable(User.tableName);
  }
};