import express from "express";
import {settingsController} from "../view-controllers/settings-controller";

const router = express.Router();
router.get("/", settingsController.getSettings.bind(settingsController));
router.post("/", settingsController.updateSetting.bind(settingsController));

export const settingsRoutes = router;
