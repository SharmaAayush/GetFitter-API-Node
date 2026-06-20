import { EquipmentController } from "@/controllers/equipment.controller";
import { Router } from "express";

const router = Router();

router.get('/', EquipmentController.getAll);

router.get('/:id', EquipmentController.getById);

export default router;