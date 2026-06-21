import Equipment from "@/models/equipment.model";
import { FilterService } from "@/helpers/filter.service";

export class EquipmentService extends FilterService {
  override className: string = 'EquipmentService';
  override model = Equipment;
}