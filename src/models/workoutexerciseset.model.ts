import { BaseModelAttributes, BaseModelCreationExcludedAttributes, CreatedAtAttribute, DeletedAtAttribute, GenerateModelShareCodeHooks, IdAttribute, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ShareCodeAttribute, UpdatedAtAttribute } from "@/types/base.models";
import { DataTypes, HasOneGetAssociationMixin, Model, Optional } from "sequelize";
import WeightUnit from "@/models/weightunits.model";
import { WorkoutExercise } from "@/models/workoutexercise.model";
import sequelize from '@/config/database'

export interface WorkoutExerciseSetAttributes extends BaseModelAttributes {
  workoutExerciseId: string;
  setNumber: number;
  reps: number;
  weight?: number;
  weightUnitId?: string;
}

export type WorkoutExerciseSetCreationAttributes = Optional<
  WorkoutExerciseSetAttributes,
  BaseModelCreationExcludedAttributes |
  "weight" |
  "weightUnitId"
>;

@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class WorkoutExerciseSet extends Model<WorkoutExerciseSetAttributes, WorkoutExerciseSetCreationAttributes> {
  declare id: string;
  declare shareCode: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date | null;

  declare workoutExerciseId: string;
  declare setNumber: number;
  declare reps: number;
  declare weight?: number;
  declare weightUnitId?: string;

  declare WeightUnit?: WeightUnit;
  declare WorkoutExercise?: WorkoutExercise;

  declare getWeightUnit: HasOneGetAssociationMixin<WeightUnit>;
  declare getWorkoutExercise: HasOneGetAssociationMixin<WorkoutExercise>;

  static prefix = "WKST";

  static initializeModel() {
    WorkoutExerciseSet.init({
        id: IdAttribute,
        shareCode: ShareCodeAttribute,
        createdAt: CreatedAtAttribute,
        updatedAt: UpdatedAtAttribute,
        deletedAt: DeletedAtAttribute,
        workoutExerciseId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        setNumber: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        reps: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        weight: {
          type: DataTypes.FLOAT,
          allowNull: true,
        },
        weightUnitId: {
          type: DataTypes.UUID,
          allowNull: true,
        },
    }, {
        sequelize,
        tableName: "WorkoutExerciseSets",
        paranoid: true,
        indexes: [
          {
            unique: true,
            fields: ["workoutExerciseId", "setNumber"],
            name: 'WKST_UNIQUE_WORKOUT_EXERCISE_SET',
          },
        ],
        hooks: GenerateModelShareCodeHooks(WorkoutExerciseSet),
    })
  }

  static associate() {
    WorkoutExerciseSet.belongsTo(WorkoutExercise, {
      foreignKey: "workoutExerciseId",
    });
    WorkoutExerciseSet.belongsTo(WeightUnit, {
      foreignKey: "weightUnitId",
    });
  }
}

WorkoutExerciseSet.initializeModel();

export default WorkoutExerciseSet;