import { Router } from "express";
import { loginController, registerController } from "./auth.controller";

const router = Router()

router.post("/register", registerController)
router.post("/login", loginController)
router.get("/refresh", registerController)
router.post("/logout", registerController)

export default router