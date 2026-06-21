import { LevelController } from "@/controllers/level.controller";
import { Router } from "express";

const router = Router();
const controller = new LevelController();

router.get('/', controller.getAll);

export default router;