import { podStore } from "../services/podStore";
import { Request, Response } from "express";


export class IndexController {

  async getIndex(req: Request, res: Response) {
    res.render("index", {
      style: req.session.style,
      pods: await req.app.podStore.getAllPods(),
      pendingNotifications: await req.app.notificationStore.getNotSilencedNotifications(),
      currentUrl: req.originalUrl,
    });
  }
}

export const indexController = new IndexController();
