import { BaseModelAttributes, BaseModelCreationExcludedAttributes, BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { DataTypes, Model, Optional } from "sequelize";
import sequelize from '@/config/database';
import { WeightUnitResponse } from "@/types/weightunit.dto";
import WorkoutExerciseSet from "./workoutexerciseset.model";

export interface WeightUnitAttributes extends BaseModelAttributes {
  name: string;
  unit: string;
}

export type WeightUnitCreationAttributes = Optional<WeightUnitAttributes, BaseModelCreationExcludedAttributes>;

@ModelWithTransformation<WeightUnitResponse>()
@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class WeightUnit extends Model<WeightUnitAttributes, WeightUnitCreationAttributes> {
  declare id: string;
  declare name: string;
  declare unit: string;
  declare shareCode: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt?: Date | null;

  static prefix = 'WGHT';

  async transform(): Promise<WeightUnitResponse> {
    return {
      id: this.shareCode,
      name: this.name,
      unit: this.unit,
    }
  }

  public static initializeModel() {
    WeightUnit.init(
      {
        ...BaseModelInitAttributes,
        unit: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        tableName: 'WeightUnits',
        paranoid: true, // Enable paranoid mode for soft deletes
        hooks: GenerateModelShareCodeHooks(WeightUnit),
      }
    );
  }

  public static associate() {
    WeightUnit.hasMany(WorkoutExerciseSet, {
      foreignKey: 'weightUnitId',
    });
  }
}

WeightUnit.initializeModel();

export default WeightUnit;