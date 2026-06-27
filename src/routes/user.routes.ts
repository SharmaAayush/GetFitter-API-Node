import { UserController } from "@/controllers/user.controller";
import { Router } from "express";

const router = Router();
const controller = new UserController();

router.post('/register', controller.registerUser.bind(controller));

router.post('/login', controller.loginUser.bind(controller));

export default router;