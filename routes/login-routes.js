"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const login_controller_1 = require("../controller/login-controller");
router.get("/", login_controller_1.loginController.getLogin.bind(login_controller_1.loginController));
router.post("/", login_controller_1.loginController.authentication.bind(login_controller_1.loginController));
exports.loginRoutes = router;
//# sourceMappingURL=login-routes.js.map