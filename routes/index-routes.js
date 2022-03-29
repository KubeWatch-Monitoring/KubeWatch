"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const index_controller_1 = require("../controller/index-controller");
router.get("/", index_controller_1.indexController.getIndex.bind(index_controller_1.indexController));
exports.indexRoutes = router;
//# sourceMappingURL=index-routes.js.map