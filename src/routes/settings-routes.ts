import express from "express";

const router = express.Router();
import {settingsController, SettingsController} from "../controller/settings-controller";

router.get("/", settingsController.getSettings.bind(settingsController));
router.post("/", settingsController.updateSetting.bind(settingsController));

export const settingsRoutes = router;
