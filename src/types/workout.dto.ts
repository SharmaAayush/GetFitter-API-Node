import { createWorkoutRequestSchema, updateWorkoutRequestSchema, deleteWorkoutRequestSchema } from "@/validators/workout.validator";
import z from "zod";
import { BaseModelResponse } from "./base.models";
import { ExerciseModelResponse } from "./exercise.dto";

export type CreateWorkoutRequest = z.infer<typeof createWorkoutRequestSchema>;
export type UpdateWorkoutRequest = z.infer<typeof updateWorkoutRequestSchema>;
export type DeleteWorkoutRequest = z.infer<typeof deleteWorkoutRequestSchema>;

export interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight?: number;
  weightUnit?: string;
}

export interface WorkoutModelResponse extends BaseModelResponse {
  description?: string;
  level: string;
  estimatedDuration?: number;
  exercises: Array<ExerciseModelResponse & {
    order: number;
    sets: Array<WorkoutSet>
  }>
}