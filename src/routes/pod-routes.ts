import express from "express";

const router = express.Router();
import { podController } from "../controller/pod-controller";

router.get("/", podController.getIndex.bind(podController));
router.get("/:id", podController.getPod.bind(podController));

export const podRoutes = router;
