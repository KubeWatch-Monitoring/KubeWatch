"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.podRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const pod_controller_1 = require("../controller/pod-controller");
router.get("/", pod_controller_1.podController.getIndex.bind(pod_controller_1.podController));
router.get("/:id(\\d+)", pod_controller_1.podController.getPod.bind(pod_controller_1.podController));
exports.podRoutes = router;
//# sourceMappingURL=pod-routes.js.map