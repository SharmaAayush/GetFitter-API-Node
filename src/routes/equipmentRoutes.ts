import { EquipmentController } from "@/controllers/equipmentController";
import { Router } from "express";

const router = Router();

router.get('/', EquipmentController.getAllEquipment);

router.get('/:id', EquipmentController.getEquipmentById);

export default router;