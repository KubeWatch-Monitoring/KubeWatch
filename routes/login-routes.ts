import express from "express";

const router = express.Router();
import { loginController } from "../controller/login-controller";

router.get("/", loginController.getLogin.bind(loginController));
router.post("/", loginController.authentication.bind(loginController));

export const loginRoutes = router;
