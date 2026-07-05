import { FilterController } from "@/helpers/filter.controller";
import { WeightUnitService } from "@/services/weightunit.service";

export class WeightUnitController extends FilterController {
  override entityName = 'WeightUnit';
  override service = new WeightUnitService();
}