import { EquipmentController } from "@/controllers/equipment.controller";
import { Router } from "express";

const router = Router();
const controller = new EquipmentController();

router.get('/', controller.getAll.bind(controller));

export default router;