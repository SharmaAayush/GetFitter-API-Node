import WeightUnit from "@/models/weightunits.model";
import { encodeUuidToShareCode } from "@/services/shareCode.service";
import { DataTypes, QueryInterface } from "sequelize";
import { uuidv7 } from "uuidv7";

const weightUnits: {id: string, name: string, unit: string, shareCode: string}[] = [
  {
    id: uuidv7(),
    name: 'Kilogram',
    unit: 'kg',
    shareCode: 'WGHT-1',
  },
  {
    id: uuidv7(),
    name: 'Pound',
    unit: 'lb',
    shareCode: 'WGHT-2',
  },
];
const weightUnitsToInsert = weightUnits.map(weightUnit => {
  const shareCode = encodeUuidToShareCode(weightUnit.id, WeightUnit.prefix);
  const now = new Date();

  return {
    ...weightUnit,
    shareCode,
    createdAt: now,
    updatedAt: now,
  }
});

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.createTable(WeightUnit.tableName, {
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
      unit: {
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

    await queryInterface.bulkInsert('WeightUnits', weightUnitsToInsert);
  },
  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('WeightUnits');
  }
};