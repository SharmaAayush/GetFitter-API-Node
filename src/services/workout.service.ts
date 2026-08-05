import Exercise from "@/models/exercise.model";
import WeightUnit from "@/models/weightunits.model";
import { CreateWorkoutRequest, UpdateWorkoutRequest } from "@/types/workout.dto";
import logger from "@/services/logger";
import { ERROR_REASONS } from "@/consts/error-reasons";
import { errAsync, okAsync } from "neverthrow";
import sequelize from '@/config/database'
import Workout, { WorkoutCreationAttributes } from "@/models/workout.model";
import { CreationAttributes, Optional } from "sequelize";
import { NullishPropertiesOf } from "sequelize/lib/utils";
import WorkoutExercise from "@/models/workoutexercise.model";
import WorkoutExerciseSet from "@/models/workoutexerciseset.model";
import { uuidv7 } from "uuidv7";
import { getLevelPriority } from "@/helpers/level";
import Level from "@/models/level.model";
import { UserModelResponse } from "@/types/user.dto";
import { transformModelArr } from "./util";
import User from "@/models/user.model";

class CustomError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CustomError";
  }
}

export class WorkoutService {
  private async getAllExercises(exerciseShareCodes: string[]) {
    const exercises = await Exercise.findAll({
      where: { shareCode: exerciseShareCodes }, include: {
        all: true,
      }
    });
    return exercises;
  }

  private getAllWeightUnits(weightUnitShareCodes: string[]) {
    const weightUnits = WeightUnit.findAll({ where: { shareCode: weightUnitShareCodes } });
    return weightUnits;
  }

  private async getNestedModels(workoutBody: { exercises: CreateWorkoutRequest['body']['exercises'] }) {
    const exerciseIds: string[] = [];
    const weighUnitIds: string[] = [];
    const levels: Level[] = [];
    let maxPriorityLevel: Level = await Level.findOne({
      order: [['createdAt', 'ASC']],
      rejectOnEmpty: true,
    });
    workoutBody.exercises.forEach(exercise => {
      exerciseIds.push(exercise.exerciseId);
      weighUnitIds.push(
        ...exercise.sets
          .map(set => set.weightUnit)
          .filter(id => id !== undefined)
      );
    });

    const exercises = await this.getAllExercises(exerciseIds);
    const weightUnits = await this.getAllWeightUnits(weighUnitIds);

    const exerciseMap = new Map(
      exercises.map(exercise => {
        const level = exercise.Level as Level;
        levels.push(level);
        if (getLevelPriority(level.name) > getLevelPriority(maxPriorityLevel.name)) {
          maxPriorityLevel = level;
        }
        return [exercise.shareCode, exercise]
      })
    );
    const weightUnitMap = new Map(
      weightUnits.map(weightUnit => [weightUnit.shareCode, weightUnit])
    );
    const levelsMap = new Map(
      levels.map(level => [level.shareCode, level])
    )
    return { exerciseMap, weightUnitMap, levelsMaap: levelsMap, maxPriorityLevel };
  }

  async createWorkout(workoutBody: CreateWorkoutRequest['body'], user: UserModelResponse) {
    try {
      const { exerciseMap, weightUnitMap, maxPriorityLevel } = await this.getNestedModels(workoutBody);
      let workout: Workout | null = null;

      await sequelize.transaction(async transaction => {
        const createWorkoutAttributes: Optional<WorkoutCreationAttributes, NullishPropertiesOf<WorkoutCreationAttributes>> = {
          name: workoutBody.name,
          userId: user.id,
          levelId: maxPriorityLevel.id,
        }
        if (typeof workoutBody.description === 'string') createWorkoutAttributes.description = workoutBody.description;
        if (typeof workoutBody.estimatedDuration === 'number') createWorkoutAttributes.estimatedDuration = workoutBody.estimatedDuration;
        workout = await Workout.create(createWorkoutAttributes, { transaction });
        const createdWorkout = workout;

        const createWorkoutExercisesRecords: Array<CreationAttributes<WorkoutExercise>> = [];
        const createWorkoutExerciseSetsRecords: Array<CreationAttributes<WorkoutExerciseSet>> = [];

        workoutBody.exercises.forEach(exercise => {
          const exerciseRecord = exerciseMap.get(exercise.exerciseId);
          if (!exerciseRecord) throw new CustomError(`Invalid exercise share code ${exercise.exerciseId}`);
          // TODO: return errAsync here
          const workoutExerciseId = uuidv7();
          const createWorkoutExerciseRecord: CreationAttributes<WorkoutExercise> = {
            id: workoutExerciseId,
            workoutId: createdWorkout.id,
            exerciseId: exerciseRecord.id,
            orderIndex: exercise.order,
          }
          createWorkoutExercisesRecords.push(createWorkoutExerciseRecord);

          exercise.sets.forEach(set => {
            const weightUnitRecord = set.weightUnit ? weightUnitMap.get(set.weightUnit) : null;
            const weightUnitPresent = set.weightUnit;
            if (!weightUnitRecord && weightUnitPresent) throw new CustomError(`Invalid weight unit share code ${set.weightUnit}`);
            // TODO: return errAsync here
            const createWorkoutExerciseSetRecord: CreationAttributes<WorkoutExerciseSet> = {
              reps: set.reps,
              setNumber: set.setNumber,
              workoutExerciseId: workoutExerciseId,
            }
            if (weightUnitPresent) {
              createWorkoutExerciseSetRecord.weight = set.weight as number;
              createWorkoutExerciseSetRecord.weightUnitId = (weightUnitRecord as WeightUnit).id;
            }
            createWorkoutExerciseSetsRecords.push(createWorkoutExerciseSetRecord);
          });
        });

        await WorkoutExercise.bulkCreate(createWorkoutExercisesRecords, { transaction });
        await WorkoutExerciseSet.bulkCreate(createWorkoutExerciseSetsRecords, { transaction });
      });

      return okAsync('Workout created successfully' as const);
    } catch (error) {
      logger.error(`Error creating workout`);
      logger.debug(error);
      if (error instanceof CustomError) {
        return errAsync({
          reason: ERROR_REASONS.BAD_REQUEST,
          details: error.message,
        } as const);
      }
      return errAsync({
        reason: ERROR_REASONS.INTERNAL_SERVER_ERROR,
        details: error,
      } as const);
    }
  }

  async getWorkouts(user: UserModelResponse) {
    try {
      const workouts = await Workout.findAll({
        where: { userId: user.id }, include: [
          { model: User },
          { model: Level },
          { model: Exercise, include: [{ all: true }] },
          {
            model: WorkoutExercise, include: [{
              model: WorkoutExerciseSet,
              include: [{ all: true }],
            }]
          },
        ]
      });
      return okAsync(await transformModelArr(workouts));
    } catch (error) {
      logger.error(`Error fetching workout`);
      logger.debug(error);
      return errAsync({
        reason: ERROR_REASONS.INTERNAL_SERVER_ERROR,
        details: error,
      } as const);
    }
  }

  async updateWorkout(workoutId: string, workoutBody: UpdateWorkoutRequest['body'], user: UserModelResponse) {
    try {
      // Find the workout by shareCode and ensure it belongs to the user
      const workout = await Workout.findOne({
        where: { shareCode: workoutId },
        include: [
          { model: User },
          { model: Level },
          { model: Exercise, include: [{ all: true }] },
          {
            model: WorkoutExercise, include: [{
              model: WorkoutExerciseSet,
              include: [{ all: true }],
            }]
          },
        ]
      });

      if (!workout) {
        return errAsync({
          reason: ERROR_REASONS.NOT_FOUND,
          details: 'Workout not found',
        } as const);
      }

      // Check if the workout belongs to the user
      if (workout.userId !== user.id) {
        return errAsync({
          reason: ERROR_REASONS.FORBIDDEN,
          details: 'You do not have permission to update this workout',
        } as const);
      }

      // If exercises are provided, update them
      if (workoutBody.exercises && workoutBody.exercises.length > 0) {
        const exercises = workoutBody.exercises;
        const { exerciseMap, weightUnitMap, maxPriorityLevel } = await this.getNestedModels({ exercises });

        await sequelize.transaction(async transaction => {
          // Update workout basic info
          if (typeof workoutBody.name === 'string') workout.name = workoutBody.name;
          if (typeof workoutBody.description === 'string') workout.description = workoutBody.description;
          if (typeof workoutBody.estimatedDuration === 'number') workout.estimatedDuration = workoutBody.estimatedDuration;
          workout.levelId = maxPriorityLevel.id;
          await workout.save({ transaction });

          // Delete existing workout exercises and sets
          await WorkoutExerciseSet.destroy({
            where: {
              workoutExerciseId: workout.WorkoutExercises?.map(we => we.id) || []
            },
            transaction
          });
          await WorkoutExercise.destroy({
            where: { workoutId: workout.id },
            transaction
          });

          // Create new workout exercises and sets
          const createWorkoutExercisesRecords: Array<CreationAttributes<WorkoutExercise>> = [];
          const createWorkoutExerciseSetsRecords: Array<CreationAttributes<WorkoutExerciseSet>> = [];

          exercises.forEach(exercise => {
            const exerciseRecord = exerciseMap.get(exercise.exerciseId);
            if (!exerciseRecord) throw new CustomError(`Invalid exercise share code ${exercise.exerciseId}`);
            const workoutExerciseId = uuidv7();
            const createWorkoutExerciseRecord: CreationAttributes<WorkoutExercise> = {
              id: workoutExerciseId,
              workoutId: workout.id,
              exerciseId: exerciseRecord.id,
              orderIndex: exercise.order,
            }
            createWorkoutExercisesRecords.push(createWorkoutExerciseRecord);

            exercise.sets.forEach(set => {
              const weightUnitRecord = set.weightUnit ? weightUnitMap.get(set.weightUnit) : null;
              const weightUnitPresent = set.weightUnit;
              if (!weightUnitRecord && weightUnitPresent) throw new CustomError(`Invalid weight unit share code ${set.weightUnit}`);
              const createWorkoutExerciseSetRecord: CreationAttributes<WorkoutExerciseSet> = {
                reps: set.reps,
                setNumber: set.setNumber,
                workoutExerciseId: workoutExerciseId,
              }
              if (weightUnitPresent) {
                createWorkoutExerciseSetRecord.weight = set.weight as number;
                createWorkoutExerciseSetRecord.weightUnitId = (weightUnitRecord as WeightUnit).id;
              }
              createWorkoutExerciseSetsRecords.push(createWorkoutExerciseSetRecord);
            });
          });

          await WorkoutExercise.bulkCreate(createWorkoutExercisesRecords, { transaction });
          await WorkoutExerciseSet.bulkCreate(createWorkoutExerciseSetsRecords, { transaction });
        });
      } else {
        // Only update basic info if no exercises provided
        if (typeof workoutBody.name === 'string') workout.name = workoutBody.name;
        if (typeof workoutBody.description === 'string') workout.description = workoutBody.description;
        if (typeof workoutBody.estimatedDuration === 'number') workout.estimatedDuration = workoutBody.estimatedDuration;
        await workout.save();
      }

      // Fetch the updated workout with all associations
      const updatedWorkout = await Workout.findOne({
        where: { shareCode: workoutId },
        include: [
          { model: User },
          { model: Level },
          { model: Exercise, include: [{ all: true }] },
          {
            model: WorkoutExercise, include: [{
              model: WorkoutExerciseSet,
              include: [{ all: true }],
            }]
          },
        ]
      });

      const transformedWorkouts = await transformModelArr([updatedWorkout!]);
      return okAsync(transformedWorkouts[0]);
    } catch (error) {
      logger.error(`Error updating workout`);
      logger.debug(error);
      if (error instanceof CustomError) {
        return errAsync({
          reason: ERROR_REASONS.BAD_REQUEST,
          details: error.message,
        } as const);
      }
      return errAsync({
        reason: ERROR_REASONS.INTERNAL_SERVER_ERROR,
        details: error,
      } as const);
    }
  }
}