import { WeightUnitController } from "@/controllers/weightunit.controller";
import { Router } from "express";

const router = Router();
const controller = new WeightUnitController();

router.get('/', controller.getAll.bind(controller));

export default router;