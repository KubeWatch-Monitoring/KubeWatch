import express from "express";
import {adminController} from "../view-controllers/admin-controller";

const router = express.Router();
router.get("/", adminController.getIndex.bind(adminController));
router.post("/", adminController.reconnect.bind(adminController));

export const adminRoutes = router;
export const BASE_URL = "/admin";
