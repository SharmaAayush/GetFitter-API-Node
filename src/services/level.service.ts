import { FilterService } from "@/helpers/filter.service";
import Level from "@/models/level";

export class LevelService extends FilterService {
  override className = 'LevelService';
  override model = Level;
}