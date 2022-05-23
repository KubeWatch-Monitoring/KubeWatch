import express from "express";
import {dbAvailabilityController} from "../view-controllers/db-availability-controller";

const router = express.Router();
router.get("/", dbAvailabilityController.getIndex.bind(dbAvailabilityController));
router.post("/", dbAvailabilityController.reconnect.bind(dbAvailabilityController));

export const dbAvailabilityRoutes = router;
export const BASE_URL = "/dbAvailability";
