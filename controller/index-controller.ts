import { podStore } from "../services/podStore";
import { Request, Response } from "express";

export class IndexController {
  async getIndex(req: Request, res: Response) {
    res.render("index", {
      style: req.session.style,
      examples: undefined,
      display: req.session.display,
      pods: await podStore.getAllPods(),
    });
  }
}

export const indexController = new IndexController();
