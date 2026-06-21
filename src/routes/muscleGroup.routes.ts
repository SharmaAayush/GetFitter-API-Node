import { MuscleGroupController } from "@/controllers/muscleGroup.controller";
import { Router } from "express";

const router = Router();
const controller = new MuscleGroupController();

router.get('/', controller.getAll.bind(controller));

export default router;