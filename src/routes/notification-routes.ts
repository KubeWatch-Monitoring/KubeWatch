import express from "express";
import {notificationController} from "../controller/notification-controller";

const router = express.Router();
router.get("/", notificationController.getIndex.bind(notificationController));
router.post("/silence", notificationController.silenceNotification.bind(notificationController));
router.post("/trigger", notificationController.trigger.bind(notificationController));

export const notificationRoutes = router;
