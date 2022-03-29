import { Example, exampleStore } from "../services/exampleStore";
import { podStore } from "../services/podStore";
import { Request, Response } from "express";
import { Settings } from "../utils/session-middleware.index";

export class IndexController {
  async getIndex(req: Request, res: Response) {
    res.render("index", {
      style: req.session.style,
      examples: await exampleStore.getAll(req.session.display as Settings),
      display: req.session.display,
      pods: await podStore.getAllPods(),
    });
  }
}

export const indexController = new IndexController();
