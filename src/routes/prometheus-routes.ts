import express from "express";
import {prometheusController} from "../controller/prometheus-controller";

const router = express.Router();
router.get("/", prometheusController.getMetrics.bind(prometheusController));

export const prometheusRoutes = router;
