import express from "express";
import {prometheusController} from "../view-controllers/prometheus-controller";

const router = express.Router();
router.get("/endpoint/:queryType", prometheusController.prometheusEndpoint.bind(prometheusController));

export const prometheusRoutes = router;
export const BASE_URL = "/prometheus";
