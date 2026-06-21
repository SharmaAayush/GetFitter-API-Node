import { FilterService } from "@/helpers/filter.service";
import Force from "@/models/force.model";

export class ForceService extends FilterService {
  override className = 'ForceService';
  override model = Force;
}