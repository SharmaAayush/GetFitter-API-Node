import { MuscleGroupService } from '@/services/muscleGroup.service';
import { FilterController } from '@/helpers/filter.controller';

export class MuscleGroupController extends FilterController {
  override service = new MuscleGroupService();
}