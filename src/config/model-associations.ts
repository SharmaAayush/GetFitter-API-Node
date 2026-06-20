import BodyPartCategory from "@/models/bodypartcategory.model";
import MuscleGroup from "@/models/musclegroup.model";
import { ModelWithAssociations } from "@/types/base.model";

const setupAssociations = (models: ModelWithAssociations[]) => {
  models.forEach(model => model.associate());
}

export const initAssociations = () => {
  setupAssociations([BodyPartCategory, MuscleGroup]);
}