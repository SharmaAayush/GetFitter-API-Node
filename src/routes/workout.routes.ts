import { WorkoutController } from "@/controllers/workout.controller";
import { Router } from "express";

const router = Router();
const controller = new WorkoutController();

router.post('/', controller.createWorkout.bind(controller));

router.get('/', controller.getWorkouts.bind(controller));

export default router;