import { BelongsToManyGetAssociationsMixin, DataTypes, HasManyGetAssociationsMixin, HasOneGetAssociationMixin, Model, Optional } from "sequelize";

import sequelize from '@/config/database'
import { ExerciseModelResponse } from "@/types/exercise.dto";
import Force from "@/models/force.model";
import Level from "@/models/level.model";
import Mechanic from "@/models/mechanic.model";
import Category from "@/models/category.model";
import Equipment from "@/models/equipment.model";
import { BaseModelAttributes, BaseModelCreationExcludedAttributes, BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import ImagePath from "@/models/image-path.model";
import { ExerciseInstruction } from "./exercise-instruction";
import MuscleGroup from "./musclegroup.model";

// Define the attributes for the Exercise model
export interface ExerciseAttributes extends BaseModelAttributes {
  name: string;
  slug: string;
  forceId?: string;
  levelId: string;
  mechanicId?: string;
  equipmentId?: string;
  categoryId: string;
  targetMuscleId: string;
}

// Define which attributes are optional when creating an Exercise instance
export type ExerciseCreationAttributes = Optional<
  ExerciseAttributes,
  BaseModelCreationExcludedAttributes
  | 'forceId'
  | 'levelId'
  | 'mechanicId'
  | 'equipmentId'
  | 'categoryId'
  | 'targetMuscleId'
>;

@ModelWithTransformation<ExerciseModelResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
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
  declare targetMuscleId: string;
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
  declare TargetMuscle?: MuscleGroup;
  declare ImagePaths?: ImagePath[];
  declare ExerciseInstructions?: ExerciseInstruction[];
  declare SecondaryMuscles?: MuscleGroup[];

  // 2. Declare the mixin getter for lazy loading fallback
  declare getForce: HasOneGetAssociationMixin<Force>;
  declare getLevel: HasOneGetAssociationMixin<Level>;
  declare getMechanic: HasOneGetAssociationMixin<Mechanic>;
  declare getEquipment: HasOneGetAssociationMixin<Equipment>;
  declare getCategory: HasOneGetAssociationMixin<Category>;
  declare getTargetMuscle: HasOneGetAssociationMixin<MuscleGroup>;
  declare getImagePaths: HasManyGetAssociationsMixin<ImagePath>;
  declare getExerciseInstructions: HasManyGetAssociationsMixin<ExerciseInstruction>;
  declare getSecondaryMuscles: BelongsToManyGetAssociationsMixin<MuscleGroup>;

  static prefix = 'EXER';

  async transform(): Promise<ExerciseModelResponse> {
    // Use eager loaded associations only, as loading 5 separate associations lazily would be inefficient
    const response: ExerciseModelResponse = {
      id: this.shareCode,
      name: this.name,
      slug: this.slug,
      force: this.Force?.name || '',
      level: this.Level?.name || '',
      mechanic: this.Mechanic?.name || '',
      equipment: this.Equipment?.name || '',
      category: this.Category?.name || '',
      targetMuscle: this.TargetMuscle?.name || '',
      secondaryMuscles: this.SecondaryMuscles?.map(muscle => muscle.name) || [],
      images: this.ImagePaths?.map(image => `/assets/${image.name}`) || [],
      instructions: this.ExerciseInstructions?.map(instruction => instruction.instruction) || [],
    };
    return response;
  }

  public static initializeModel() {
    Exercise.init(
      {
        ...BaseModelInitAttributes,
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
        targetMuscleId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'Exercises',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(Exercise),
      }
    );
  }

  public static associate() {
    Exercise.belongsTo(Force, { foreignKey: 'forceId', onDelete: 'CASCADE' });
    Exercise.belongsTo(Level, { foreignKey: 'levelId', onDelete: 'CASCADE' });
    Exercise.belongsTo(Mechanic, { foreignKey: 'mechanicId', onDelete: 'CASCADE' });
    Exercise.belongsTo(Equipment, { foreignKey: 'equipmentId', onDelete: 'CASCADE' });
    Exercise.belongsTo(Category, { foreignKey: 'categoryId', onDelete: 'CASCADE' });
    Exercise.belongsTo(MuscleGroup, { foreignKey: 'targetMuscleId', onDelete: 'CASCADE', as: 'TargetMuscle' });

    Exercise.hasMany(ImagePath, { foreignKey: 'exerciseId', onDelete: 'CASCADE' });
    Exercise.hasMany(ExerciseInstruction, { foreignKey: 'exerciseId', onDelete: 'CASCADE' });

    Exercise.belongsToMany(MuscleGroup, {
      through: 'ExerciseSecondaryMuscles',
      foreignKey: 'exerciseId',
      otherKey: 'muscleGroupId',
      as: 'SecondaryMuscles' // Custom alias for autocomplete/queries
    });
  }
}

Exercise.initializeModel();

export default Exercise;