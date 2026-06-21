import { ForceController } from "@/controllers/force.controller";
import { Router } from "express";

const router = Router();
const controller = new ForceController();

router.get('/', controller.getAll);

export default router;