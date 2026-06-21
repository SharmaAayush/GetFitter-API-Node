import { FilterService } from "@/helpers/filter.service";
import Mechanic from "@/models/mechanic";

export class MechanicService extends FilterService {
  override className = 'MechanicService';
  override model = Mechanic;
}