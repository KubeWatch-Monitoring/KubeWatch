import express from "express";
import {podController} from "../controller/pod-controller";

const router = express.Router();
router.get("/", podController.getIndex.bind(podController));
router.get("/:id", podController.getPod.bind(podController));

export const podRoutes = router;
