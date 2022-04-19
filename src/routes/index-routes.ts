import express from "express";
import {indexController} from "../controller/index-controller";

const router = express.Router();
router.get("/", indexController.getIndex.bind(indexController));

export const indexRoutes = router;
