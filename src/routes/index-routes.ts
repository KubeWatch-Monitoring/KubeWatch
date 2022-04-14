import express from "express";

const router = express.Router();
import { indexController } from "../controller/index-controller";
import { promController } from "../controller/prom-controller";

router.get("/", indexController.getIndex.bind(indexController));
// router.get("/prom-metrics", promController.getMetrics.bind(promController));

export const indexRoutes = router;
