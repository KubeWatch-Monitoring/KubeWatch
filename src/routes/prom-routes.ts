import express from "express";

const router = express.Router();
import { promController } from "../controller/prom-controller";

router.get("/", promController.getMetrics.bind(promController));

export const promRoutes = router;
