import { FilterController } from "@/helpers/filter.controller";
import { MechanicService } from "@/services/mechanic.service";

export class MechanicController extends FilterController {
  override service = new MechanicService();
}