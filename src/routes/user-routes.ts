import express from "express";
import {userController} from "../controller/user-controller";

const router = express.Router();
router.get("/", userController.getUsers.bind(userController));
router.post("/", userController.createUser.bind(userController));

export const userRoutes = router;
