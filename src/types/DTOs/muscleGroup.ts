import { BodyPartCategoryResponse } from "@/types/DTOs/bodyPartCategory";

export interface MuscleGroupResponse {
  id: string;
  name: string;
  description?: string;
  bodyPartCategory: Omit<BodyPartCategoryResponse, 'description'>;
}