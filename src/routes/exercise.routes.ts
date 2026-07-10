
import { ExerciseController } from "@/controllers/exercise.controller";
import validate from "@/middleware/validate.middleware";
import { getExerciseByShareCodeSchema, getExerciseBySlugSchema, getExercisesRequestSchema } from "@/validators/exercise.validator";
import { Router } from "express";

const router = Router();

const controller = new ExerciseController();

router.get('/', validate(getExercisesRequestSchema), controller.getExercises.bind(controller));

router.get('/slug/:slug', validate(getExerciseBySlugSchema), controller.getExerciseBySlug.bind(controller))

router.get('/shareCode/:shareCode', validate(getExerciseByShareCodeSchema), controller.getExerciseByShareCode.bind(controller));

export default router;