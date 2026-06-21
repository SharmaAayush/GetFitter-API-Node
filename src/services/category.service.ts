import { FilterService } from "@/helpers/filter.service";
import Category from "@/models/category";

export class CategoryService extends FilterService {
  override className: string = 'CategoryService';
  override model = Category;
}