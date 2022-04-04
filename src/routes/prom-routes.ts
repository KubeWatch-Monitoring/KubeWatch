import express from "express";

const router = express.Router();
import { promController } from "../controller/prom-controller";

router.get("/prom-metrics", promController.getMetrics.bind(promController));

export const promRoutes = router;
