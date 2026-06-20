import { BodyPartCategoryController } from "@/controllers/bodyPartCategory.controller";
import { Router } from "express";

const router = Router();

router.get('/', BodyPartCategoryController.getAll);

router.get('/:id', BodyPartCategoryController.getById);

export default router;