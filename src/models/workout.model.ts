import { BaseModelAttributes, BaseModelCreationExcludedAttributes, BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode, ModelWithTransformation } from "@/types/base.models";
import { BelongsToGetAssociationMixin, DataTypes, HasManyGetAssociationsMixin, Model, Optional } from "sequelize";
import User from "@/models/user.model";
import Level from "@/models/level.model";
import WorkoutExercise from "@/models/workoutexercise.model";
import Exercise from "@/models/exercise.model";
import sequelize from '@/config/database'
import { WorkoutModelResponse, WorkoutSet } from "@/types/workout.dto";

export interface WorkoutAttributes extends BaseModelAttributes {
  name: string,
  userId: string,
  description?: string,
  levelId: string,
  estimatedDuration?: number,
}

export type WorkoutCreationAttributes = Optional<WorkoutAttributes, BaseModelCreationExcludedAttributes | 'description' | 'levelId'>;

@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
@ModelWithTransformation<WorkoutModelResponse>()
export class Workout extends Model<WorkoutAttributes, WorkoutCreationAttributes> {
  declare id: string;
  declare shareCode: string;
  declare createdAt?: Date;
  declare updatedAt?: Date;
  declare deletedAt?: Date | null;

  declare name: string;
  declare userId: string;
  declare description?: string;
  declare levelId: string;
  declare estimatedDuration?: number;

  declare User?: User;
  declare Level?: Level;
  declare WorkoutExercises?: WorkoutExercise[];
  declare Exercises?: Exercise[];

  declare getUser: BelongsToGetAssociationMixin<User>;
  declare getLevel: BelongsToGetAssociationMixin<Level>;
  declare getWorkoutExercise: HasManyGetAssociationsMixin<WorkoutExercise>;
  declare getExercise: HasManyGetAssociationsMixin<Exercise>;

  static prefix = "WKT";

  async transform(): Promise<WorkoutModelResponse> {
    const transformedExercises = await Promise.all(
      (this.Exercises || []).map((ex) => ex.transform())
    );
    const workoutExercises = this.WorkoutExercises as WorkoutExercise[];
    const response: WorkoutModelResponse = {
      id: this.shareCode,
      name: this.name,
      level: this.Level?.name || '',
      exercises: transformedExercises.map((ex, index) => {
        const workoutExercise = workoutExercises[index];
        return {
          ...ex,
          order: workoutExercise?.orderIndex || 0,
          sets: (workoutExercise?.WorkoutExerciseSets || []).map(set => {
            const resSet: WorkoutSet = {
              setNumber: set.setNumber,
              reps: set.reps,
            }
            if (typeof set.weight === 'number') resSet.weight = set.weight;
            if (set.WeightUnit) resSet.weightUnit = set.WeightUnit.name;
            return resSet;
          }),
        }
      }),
    }
    if (this.description) response.description = this.description;
    if (this.estimatedDuration !== undefined) response.estimatedDuration = this.estimatedDuration;
    return response;
  }

  static initializeModel() {
    Workout.init({
      ...BaseModelInitAttributes,
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      levelId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      estimatedDuration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: "Workouts",
      paranoid: true,
      hooks: GenerateModelShareCodeHooks<Workout>(Workout),
    });
  }

  static associate() {
    Workout.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Workout.belongsTo(Level, { foreignKey: 'levelId', onDelete: 'CASCADE' });
    Workout.hasMany(WorkoutExercise, { foreignKey: 'workoutId', onDelete: 'CASCADE' });
    Workout.belongsToMany(Exercise, { through: WorkoutExercise, foreignKey: 'workoutId', otherKey: 'exerciseId' });
  }
}

Workout.initializeModel();

export default Workout;