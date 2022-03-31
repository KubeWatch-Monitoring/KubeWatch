"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const prom_controller_1 = require("../controller/prom-controller");
router.get("/prom-metrics", prom_controller_1.promController.getMetrics.bind(prom_controller_1.promController));
exports.promRoutes = router;
//# sourceMappingURL=prom-routes.js.map