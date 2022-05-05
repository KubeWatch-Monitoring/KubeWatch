import express from 'express';
import { clusterDataController } from "../view-controllers/cluster-data-controller";

const router = express.Router();
router.get("/", clusterDataController.sendClusterData.bind(clusterDataController));

export const clusterDataRoutes = router;