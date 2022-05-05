import express from "express";
import {clusterVisController} from "../view-controllers/cluster-vis-controller";

const router = express.Router();
router.get("/", clusterVisController.getGraphs.bind(clusterVisController));

export const clusterVisRoutes = router;
