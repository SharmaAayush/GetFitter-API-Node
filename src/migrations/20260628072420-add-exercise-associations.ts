import { AddConstraintOptions, QueryInterface, QueryInterfaceOptions } from 'sequelize';

import { Exercise } from '@/models/exercise.model';
import Category from '@/models/category.model';
import Force from '@/models/force.model';
import Level from '@/models/level.model';
import Mechanic from '@/models/mechanic.model';
import Equipment from '@/models/equipment.model';

const CONSTRAINTS: ((AddConstraintOptions & QueryInterfaceOptions) | undefined)[] = [
  {
    fields: ['forceId'],
    type: 'foreign key',
    name: 'fk_exercises_force_id',
    references: {
      table: Force.tableName,
      field: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  {
    fields: ['levelId'],
    type: 'foreign key',
    name: 'fk_exercises_level_id',
    references: {
      table: Level.tableName,
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
  {
    fields: ['mechanicId'],
    type: 'foreign key',
    name: 'fk_exercises_mechanic_id',
    references: {
      table: Mechanic.tableName,
      field: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  {
    fields: ['equipmentId'],
    type: 'foreign key',
    name: 'fk_exercises_equipment_id',
    references: {
      table: Equipment.tableName,
      field: 'id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  },
  {
    fields: ['categoryId'],
    type: 'foreign key',
    name: 'fk_exercises_category_id',
    references: {
      table: Category.tableName,
      field: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  },
];

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await Promise.all(
      CONSTRAINTS.map(constraint => queryInterface.addConstraint(Exercise.tableName, constraint)),
    )
  },

  down: async (queryInterface: QueryInterface) => {
    await Promise.all(
      CONSTRAINTS.map(constraint => queryInterface.removeConstraint(Exercise.tableName, constraint?.name as string)),
    )
  }
};