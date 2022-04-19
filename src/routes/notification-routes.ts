import express from "express";

const router = express.Router();
import { notificationController } from "../controller/notification-controller";

router.get("/", notificationController.getIndex.bind(notificationController));
router.post("/silence", notificationController.silenceNotification.bind(notificationController));
router.post("/trigger", notificationController.trigger.bind(notificationController));

export const notificationRoutes = router;
