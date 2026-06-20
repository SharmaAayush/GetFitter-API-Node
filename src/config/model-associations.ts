import BodyPartCategory from "@/models/bodypartcategory.model";
import MuscleGroup from "@/models/musclegroup.model";
import { BaseModel } from "@/types/base.model";

const setupAssociations = (models: BaseModel[]) => {
  models.forEach(model => model.associate());
}

export const initAssociations = () => {
  setupAssociations([BodyPartCategory, MuscleGroup]);
}