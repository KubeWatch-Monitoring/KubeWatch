import { Request, Response } from "express";

export class PodController {
  async getIndex(req: Request, res: Response) {
    res.render("listPods", {
      style: req.session.style,
      display: req.session.display,
      pods: await req.app.prometheusService.getAllPods(),
    });
  }

  async getPod(req: Request, res: Response) {
    const reqId = req.params.id;
    if (reqId == undefined) {
      res.status(400).end();
      return;
    }

    let pod;
    try {
      const id = String(reqId);
      pod = await req.app.prometheusService.getPodById(id);
    } catch(e) {
      res.status(500).end();
      return;
    }

    if (pod == null) {
      res.status(404).end();
      return;
    }

    res.render("podView", {
      style: req.session.style,
      display: req.session.display,
      pod: pod,
    });
  }
}

export const podController = new PodController();
