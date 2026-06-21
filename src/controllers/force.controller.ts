import { FilterController } from "@/helpers/filter.controller";
import { ForceService } from "@/services/force.service";

export class ForceController extends FilterController {
  override service = new ForceService();
}