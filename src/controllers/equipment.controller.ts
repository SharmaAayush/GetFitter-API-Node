import { FilterController } from '@/helpers/filter.controller';
import { EquipmentService } from '@/services/equipment.service';

export class EquipmentController extends FilterController {
  service = new EquipmentService();
}