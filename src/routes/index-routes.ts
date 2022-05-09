import express from "express";
import {indexController} from "../view-controllers/index-controller";

// TODO: Update the path to edit to be a subpath
const router = express.Router();
router.get("/", indexController.getIndex.bind(indexController));
router.get("/edit", indexController.getEditDashboard.bind(indexController));
router.post("/edit", indexController.postEditDashboard.bind(indexController));
router.get("/all", indexController.getAllChartSettings.bind(indexController));
router.post("/delete", indexController.deleteCharSetting.bind(indexController));

export const indexRoutes = router;
export const BASE_URL = "/";
