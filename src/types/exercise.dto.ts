export interface ExerciseModelResponse {
  id: string,
  name: string,
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
  forceId?: string;
  levelId?: string;
  mechanicId?: string;
  equipmentId?: string;
  categoryId?: string;
}