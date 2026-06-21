import MuscleGroup from "@/models/musclegroup.model";
import { FilterService } from "@/helpers/filter.service";

export class MuscleGroupService extends FilterService {
  override className = 'MuscleGroupService';
  override model = MuscleGroup;
}