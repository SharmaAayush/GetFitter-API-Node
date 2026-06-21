import { FilterController } from "@/helpers/filter.controller";
import { LevelService } from "@/services/level.service";

export class LevelController extends FilterController {
  override service = new LevelService();
}