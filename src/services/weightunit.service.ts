import { FilterService } from "@/helpers/filter.service";
import WeightUnit from "@/models/weightunits.model";

export class WeightUnitService extends FilterService {
  override className = 'WeightUnitService';
  override model = WeightUnit;
}