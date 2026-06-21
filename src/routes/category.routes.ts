import { CategoryController } from "@/controllers/category.controller";
import { Router } from "express";

const router = Router();
const controller = new CategoryController();

router.get('/', controller.getAll.bind(controller));

export default router;