import { BodyPartCategoryController } from "@/controllers/bodyPartCategoryController";
import { Router } from "express";

const router = Router();

router.get('/', BodyPartCategoryController.getAll);

router.get('/:id', BodyPartCategoryController.getById);

export default router;