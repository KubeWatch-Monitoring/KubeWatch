import express from "express";

const router = express.Router();
import { indexController } from "../controller/index-controller.js";

router.get("/", indexController.getIndex.bind(indexController));

export const indexRoutes = router;
