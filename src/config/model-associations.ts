import BodyPartCategory from "@/models/bodypartcategory.model";
import MuscleGroup from "@/models/musclegroup.model";
import { IModelWithAssociations } from "@/types/base.models";

const setupAssociations = (models: IModelWithAssociations[]) => {
  models.forEach(model => model.associate());
}

export const initAssociations = () => {
  setupAssociations([BodyPartCategory, MuscleGroup]);
}