import { z } from "zod";
import { BaseModelResponse } from "./base.models";
import { getExerciseByShareCodeSchema, getExerciseBySlugSchema, getExercisesRequestSchema } from "@/validators/exercise.validator";

export interface ExerciseModelResponse extends BaseModelResponse {
  slug: string,
  force: string,
  level: string,
  mechanic: string,
  equipment: string,
  category: string,
  targetMuscle: string,
  secondaryMuscles: string[],
  images: string[],
  instructions: string[],
}

export type GetExercisesRequest = z.infer<typeof getExercisesRequestSchema>;

export type GetExerciseBySlugRequest = z.infer<typeof getExerciseBySlugSchema>;

export type GetExerciseByShareCodeRequest = z.infer<typeof getExerciseByShareCodeSchema>;
