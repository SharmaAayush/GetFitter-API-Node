import { FilterService } from "@/helpers/filter.service";
import Category from "@/models/category.model";

export class CategoryService extends FilterService {
  override className: string = 'CategoryService';
  override model = Category;
}