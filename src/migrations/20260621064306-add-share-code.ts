'use strict';

import Equipment from "@/models/equipment.model";
import MuscleGroup from "@/models/musclegroup.model";
import logger from "@/services/logger";
import { encodeUuidToShareCode } from "@/services/shareCode.service";
import { DataTypes, Model, ModelStatic, QueryInterface } from "sequelize";

async function addShareCodeToEquipments(queryInterface: QueryInterface, model: ModelStatic<Model>, prefix: string) {
  const attributes = model.getAttributes();

  // 1. Check if the 'id' attribute exists
  if (!attributes['id']) {
    logger.error(`Migration Failed: Model "${model.name}" is missing the "id" attribute.`);
    return;
  }

  // 2. Extract and verify the DataType is UUID
  // We check the string class name representation ('UUID') to avoid prototype mismatch bugs
  const idType = attributes['id'].type.toString({});

  if (idType !== 'UUID') {
    logger.error(`Migration Failed: Model "${model.name}" id attribute is type "${idType}", expected "UUID".`);
    return;
  }
  // 3: Add the column allowing NULL values temporarily
  await queryInterface.addColumn(model.tableName, 'shareCode', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  // 4: Fetch existing rows using raw query interface
  const [records] = await queryInterface.sequelize.query(
    `SELECT id FROM "${model.tableName}";`
  ) as [{ id: string }[], unknown];

  // Compute and populate shareCode values sequentially
  for (const record of records) {
    const shareCode = encodeUuidToShareCode(record.id, prefix);
    await queryInterface.sequelize.query(
      `UPDATE "${model.tableName}" SET "shareCode" = :shareCode WHERE id = :id;`,
      {
        replacements: { shareCode, id: record.id }
      }
    );
  }

  // 5: Tighten down constraints now that every row is populated
  await queryInterface.changeColumn(model.tableName, 'shareCode', {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensures database-level uniqueness going forward
  });
  return;
}

module.exports = {
  async up(queryInterface: QueryInterface) {
    await addShareCodeToEquipments(queryInterface, Equipment, Equipment.prefix);
    await addShareCodeToEquipments(queryInterface, MuscleGroup, MuscleGroup.prefix);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn(Equipment.tableName, 'shareCode');
    await queryInterface.removeColumn(MuscleGroup.tableName, 'shareCode');
  }
};
