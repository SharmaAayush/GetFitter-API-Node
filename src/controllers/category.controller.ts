import { FilterController } from '@/helpers/filter.controller';
import { CategoryService } from '@/services/category.service';

export class CategoryController extends FilterController {
  override entityName = 'Category';
  override service = new CategoryService();
}