import BodyPartCategory from "@/models/bodypartcategory.model";
import Equipment from "@/models/equipment.model";
import MuscleGroup from "@/models/musclegroup.model";
import { IModelWithInitialization } from "@/types/base.models";

export const initializeModels = () => {
  const models: IModelWithInitialization[] = [BodyPartCategory, Equipment, MuscleGroup];

  models.forEach(model => model.initializeModel());
}