import { BaseModelAttributes, BaseModelCreationExcludedAttributes, CreatedAtAttribute, DeletedAtAttribute, GenerateModelShareCodeHooks, IdAttribute, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ShareCodeAttribute, UpdatedAtAttribute } from "@/types/base.models";
import { DataTypes, HasManyGetAssociationsMixin, HasOneGetAssociationMixin, Model, Optional } from "sequelize";
import WorkoutExerciseSet from "@/models/workoutexerciseset.model";
import { Workout } from "@/models/workout.model";
import Exercise from "@/models/exercise.model";
import sequelize from '@/config/database'

export interface WorkoutExerciseAttributes extends BaseModelAttributes {
  workoutId: string;
  exerciseId: string;
  orderIndex: number;
}

export type WorkoutExerciseCreationAttributes = Optional<
  WorkoutExerciseAttributes,
  BaseModelCreationExcludedAttributes
>;

@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
export class WorkoutExercise extends Model<WorkoutExerciseAttributes, WorkoutExerciseCreationAttributes> {
  declare id: string;
  declare shareCode: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date | null;

  declare workoutId: string;
  declare exerciseId: string;
  declare orderIndex: number;

  declare Workout?: Workout;
  declare Exercise?: Exercise;
  declare WorkoutExerciseSets?: WorkoutExerciseSet[];

  declare getWorkout: HasOneGetAssociationMixin<Workout>;
  declare getExercise: HasOneGetAssociationMixin<Exercise>;
  declare getWorkoutExerciseSets: HasManyGetAssociationsMixin<WorkoutExerciseSet>;

  static prefix = "WKEX";

  static initializeModel() {
    WorkoutExercise.init({
      id: IdAttribute,
      shareCode: ShareCodeAttribute,
      createdAt: CreatedAtAttribute,
      updatedAt: UpdatedAtAttribute,
      deletedAt: DeletedAtAttribute,
      workoutId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      exerciseId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      orderIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {
      sequelize,
      tableName: "WorkoutExercises",
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ["workoutId", "orderIndex"],
          name: "WKEX_UNIQUE_WORKOUT_EXERCISE_ORDER_INDEX",
        },
      ],
      hooks: GenerateModelShareCodeHooks<WorkoutExercise>(WorkoutExercise),
    });
  }

  static associate() {
    WorkoutExercise.belongsTo(Workout, { foreignKey: 'workoutId' });
    WorkoutExercise.belongsTo(Exercise, { foreignKey: 'exerciseId' });
    WorkoutExercise.hasMany(WorkoutExerciseSet, { foreignKey: 'workoutExerciseId', onDelete: 'CASCADE' });
  }
}

WorkoutExercise.initializeModel();

export default WorkoutExercise;