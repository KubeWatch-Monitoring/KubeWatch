import { podStore } from "../services/podStore";
import { prometheusService } from "../services/prometheusService";
import { Request, Response } from "express";

enum Visibility {
  Hidden,
  Show
}

class Notification {
  constructor(
      public message: string,
  ) {}
}

export class IndexController {
  async getIndex(req: Request, res: Response) {
    res.render("index", {
      notification: new Notification("my message"),
      style: req.session.style,
      display: req.session.display,
    });
  }
}

export const indexController = new IndexController();
