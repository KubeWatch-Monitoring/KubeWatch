import express from "express";
import {clusterVisController} from "../view-controllers/cluster-vis-controller";

const router = express.Router();
router.get("/", clusterVisController.getGraphs.bind(clusterVisController));
router.get("/data", clusterVisController.sendClusterData.bind(clusterVisController))

export const clusterVisRoutes = router;
export const BASE_URL = "/cluster-visualisation";
