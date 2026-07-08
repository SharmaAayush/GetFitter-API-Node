import { BaseModelAttributes, BaseModelCreationExcludedAttributes, BaseModelInitAttributes, GenerateModelShareCodeHooks, ModelWithAssociations, ModelWithInitialization, ModelWithShareCode } from "@/types/base.models";
import { BelongsToGetAssociationMixin, DataTypes, HasManyGetAssociationsMixin, Model, Optional } from "sequelize";
import User from "@/models/user.model";
import Level from "@/models/level.model";
import WorkoutExercise from "@/models/workoutexercise.model";
import Exercise from "@/models/exercise.model";
import sequelize from '@/config/database'

export interface WorkoutAttributes extends BaseModelAttributes {
  name: string,
  userId: string,
  description?: string,
  levelId: string,
  estimatedDuration: number,
}

export type WorkoutCreationAttributes = Optional<WorkoutAttributes, BaseModelCreationExcludedAttributes | 'description' | 'levelId'>;

@ModelWithInitialization()
@ModelWithShareCode()
@ModelWithAssociations()
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
  declare estimatedDuration: number;

  declare User?: User;
  declare Level?: Level;
  declare WorkoutExercise?: WorkoutExercise[];
  declare Exercise?: Exercise[];

  declare getUser: BelongsToGetAssociationMixin<User>;
  declare getLevel: BelongsToGetAssociationMixin<Level>;
  declare getWorkoutExercise: HasManyGetAssociationsMixin<WorkoutExercise>;
  declare getExercise: HasManyGetAssociationsMixin<Exercise>;

  static prefix = "WKT";

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