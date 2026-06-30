import { Model } from "sequelize";

import sequelize from '@/config/database';
import { BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { FilterAttributes, FilterCreationAttributes, FilterModelResponse } from "@/types/filter.model";
import Exercise from "./exercise.model";

@ModelWithTransformation<FilterModelResponse>()
@ModelWithInitialization()
@ModelWithAssociations()
@ModelWithShareCode()
export class MuscleGroup extends Model<FilterAttributes, FilterCreationAttributes> {
  declare id: string;
  declare name: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;

  static prefix = 'MSCL';

  async transform(): Promise<FilterModelResponse> {
    const response: FilterModelResponse = {
      id: this.shareCode,
      name: this.name,
    }
    return response;
  }

  public static initializeModel() {
    MuscleGroup.init(
      { ...BaseModelInitAttributes },
      {
        sequelize,
        tableName: 'MuscleGroups',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(MuscleGroup),
      }
    );
  }

  public static associate() {
    MuscleGroup.hasMany(Exercise, { foreignKey: 'targetMuscleId', onDelete: 'CASCADE', as: 'TargetMuscle' });
    MuscleGroup.belongsToMany(Exercise, {
      through: 'ExerciseSecondaryMuscles',
      foreignKey: 'muscleGroupId',
      otherKey: 'exerciseId',
      as: 'SecondaryExercises'
    });
  }
}

MuscleGroup.initializeModel();

export default MuscleGroup;