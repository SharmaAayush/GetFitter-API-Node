import { DataTypes, HasOneGetAssociationMixin, Model, Optional } from "sequelize";
import { uuidv7 } from "uuidv7";

import sequelize from '@/config/database'
import { ExerciseModelResponse } from "@/types/exercise.dto";
import Force from "@/models/force.model";
import Level from "@/models/level.model";
import Mechanic from "@/models/mechanic.model";
import Category from "@/models/category.model";
import Equipment from "@/models/equipment.model";
import { addShareCodeToModel } from "@/services/shareCode.service";
import { ModelWithAssociations, ModelWithInitialization, ModelWithTransformation } from "@/types/base.models";

// Define the attributes for the Exercise model
export interface ExerciseAttributes {
  id: string;
  name: string;
  shareCode: string;
  slug: string;
  forceId?: string;
  levelId: string;
  mechanicId?: string;
  equipmentId?: string;
  categoryId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

// Define which attributes are optional when creating an Exercise instance
export type ExerciseCreationAttributes = Optional<
  ExerciseAttributes,
  'id'
  | 'shareCode'
  | 'forceId'
  | 'levelId'
  | 'mechanicId'
  | 'equipmentId'
  | 'categoryId'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
>;

@ModelWithTransformation<ExerciseModelResponse>()
@ModelWithInitialization()
@ModelWithAssociations()
export class Exercise extends Model<ExerciseAttributes, ExerciseCreationAttributes> {
  declare id: string;
  declare name: string;
  declare shareCode: string;
  declare slug: string;
  declare forceId: string;
  declare levelId: string;
  declare mechanicId: string;
  declare equipmentId: string;
  declare categoryId: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date | null;

  // 1. Declare the association property for eager loading
  // Use NonAttribute to tell Sequelize this is not a database column
  declare Force?: Force;
  declare Level?: Level;
  declare Mechanic?: Mechanic;
  declare Equipment?: Equipment;
  declare Category?: Category;

  // 2. Declare the mixin getter for lazy loading fallback
  declare getForce: HasOneGetAssociationMixin<Force>;
  declare getLevel: HasOneGetAssociationMixin<Level>;
  declare getMechanic: HasOneGetAssociationMixin<Mechanic>;
  declare getEquipment: HasOneGetAssociationMixin<Equipment>;
  declare getCategory: HasOneGetAssociationMixin<Category>;

  static prefix = 'EXER';

  async transform(): Promise<ExerciseModelResponse> {
    // Use eager loaded associations only, as loading 5 separate associations lazily would be inefficient
    const response: ExerciseModelResponse = {
      id: this.shareCode,
      name: this.name,
      force: this.Force?.name || '',
      level: this.Level?.name || '',
      mechanic: this.Mechanic?.name || '',
      equipment: this.Equipment?.name || '',
      category: this.Category?.name || '',
    };
    return response;
  }

  public static initializeModel() {
    Exercise.init(
      {
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
      },
      {
        sequelize,
        tableName: 'Exercises',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: {
          beforeCreate: (exercise: Exercise) => {
            addShareCodeToModel(exercise, Exercise.prefix);
          },
          beforeBulkCreate: (muscleGroups: Exercise[]) => {
            // Support bulk operations safely for seeders
            for (const muscleGroup of muscleGroups) {
              addShareCodeToModel(muscleGroup, Exercise.prefix);
            }
          }
        },
      }
    );
  }

  public static associate() {
    Exercise.belongsTo(Force, { foreignKey: 'forceId', onDelete: 'CASCADE' });
    Exercise.belongsTo(Level, { foreignKey: 'levelId', onDelete: 'CASCADE' });
    Exercise.belongsTo(Mechanic, { foreignKey: 'mechanicId', onDelete: 'CASCADE' });
    Exercise.belongsTo(Equipment, { foreignKey: 'equipmentId', onDelete: 'CASCADE' });
    Exercise.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
  }
}

Exercise.initializeModel();

export default Exercise;