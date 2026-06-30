import { FiltersController } from "@/controllers/filters.controller";
import { Router } from "express";

const router = Router();
const controller = new FiltersController();

router.get('/', controller.getFilters.bind(controller));

export default router;