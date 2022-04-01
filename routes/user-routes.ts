import express from "express";

const router = express.Router();
import {userController} from "../controller/user-controller";

router.get("/", userController.getUsers.bind(userController));
router.post("/", userController.createUser.bind(userController));

export const userRoutes = router;
