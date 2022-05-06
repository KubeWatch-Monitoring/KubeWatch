import express from "express";
import {indexController} from "../view-controllers/index-controller";

const router = express.Router();
router.get("/", indexController.getIndex.bind(indexController));

export const indexRoutes = router;
export const BASE_URL = "/";
