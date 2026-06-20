import { MuscleGroupController } from "@/controllers/muscleGroup.controller";
import { Router } from "express";

const router = Router();

router.get('/', MuscleGroupController.getAll);

router.get('/:id', MuscleGroupController.getById);

export default router;