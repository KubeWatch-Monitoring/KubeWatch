import { Request, Response } from "express";

const USERNAME = "k8s";
const PASSWORD = "k8s";

export class LoginController {
  async getLogin(req: Request, res: Response) {
    res.render("login", {
      style: req.session.style,
      display: req.session.display,
    });
  }

  async authentication(req: Request, res: Response) {
    let { username, password } = req.body;
    if (username != USERNAME || password != PASSWORD) {
      res.json({
        message: "Login unsuccessful",
        success: false,
      });
      res.status(403);
    } else {
      res.json({
        message: "Login successful",
        success: true,
      });
      res.status(200);
    }
  }
}

export const loginController = new LoginController();
