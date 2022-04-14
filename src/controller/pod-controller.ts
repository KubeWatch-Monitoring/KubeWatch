import { Request, Response } from "express";
import { podStore } from "../services/podStore";
import { Settings } from "../utils/session-middleware.index";
import {prometheusService} from "../services/prometheusService";

export class PodController {
  async getIndex(req: Request, res: Response) {
    res.render("listPods", {
      style: req.session.style,
      display: req.session.display,
      pods: await prometheusService.getAllPods(),
    });
  }

  async getPod(req: Request, res: Response) {
    const id = req.params.id;
    const pod = await podStore.getPodById(id.toString());
    res.render("podView", {
      style: req.session.style,
      display: req.session.display,
      pod: pod,
    });
  }
}

export const podController = new PodController();
