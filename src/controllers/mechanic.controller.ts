import { FilterController } from "@/helpers/filter.controller";
import { MechanicService } from "@/services/mechanic.service";

export class MechanicController extends FilterController {
  override entityName = 'Mechanic';
  override service = new MechanicService();
}