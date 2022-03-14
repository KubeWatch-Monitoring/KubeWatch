"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginController = exports.LoginController = void 0;
const USERNAME = "k8s";
const PASSWORD = "k8s";
class LoginController {
    async getLogin(req, res) {
        res.render("login", {
            style: req.session.style,
            display: req.session.display,
        });
    }
    async authentication(req, res) {
        let { username, password } = req.body;
        if (username != USERNAME || password != PASSWORD) {
            res.json({
                message: "Login unsuccessful",
                success: false,
            });
            res.status(403);
        }
        else {
            res.json({
                message: "Login successful",
                success: true,
            });
            res.status(200);
        }
    }
}
exports.LoginController = LoginController;
exports.loginController = new LoginController();
//# sourceMappingURL=login-controller.js.map