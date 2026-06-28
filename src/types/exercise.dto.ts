import { BaseModelResponse } from "./base.models";

export interface ExerciseModelResponse extends BaseModelResponse {
  slug: string,
  force: string,
  level: string,
  mechanic: string,
  equipment: string,
  category: string,
}

export interface GetExercisesQuery {
  page?: string;
  limit?: string;
  name?: string;
  force?: string;
  level?: string;
  mechanic?: string;
  equipment?: string;
  category?: string;
}