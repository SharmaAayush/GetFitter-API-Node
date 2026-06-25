
import { ExerciseController } from "@/controllers/exercise.controller";
import { Router } from "express";

const router = Router();

const controller = new ExerciseController();

router.get('/', controller.getExercises.bind(controller));

router.get('/slug/:slug', controller.getExerciseBySlug.bind(controller))

router.get('/shareCode/:shareCode', controller.getExerciseByShareCode.bind(controller));

export default router;