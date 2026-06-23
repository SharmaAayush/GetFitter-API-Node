
import { ExerciseController } from "@/controllers/exercise.controller";
import { Router } from "express";

const router = Router();

const controller = new ExerciseController();

router.get('/', controller.getExercises.bind(controller));

export default router;