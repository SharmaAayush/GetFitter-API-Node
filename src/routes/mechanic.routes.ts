import { MechanicController } from "@/controllers/mechanic.controller";
import { Router } from "express";

const router = Router();
const controller = new MechanicController();

router.get('/', controller.getAll);

export default router;