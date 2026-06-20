import { EquipmentController } from "@/controllers/equipment.controller";
import { Router } from "express";

const router = Router();

router.get('/', EquipmentController.getAllEquipment);

router.get('/:id', EquipmentController.getEquipmentById);

export default router;