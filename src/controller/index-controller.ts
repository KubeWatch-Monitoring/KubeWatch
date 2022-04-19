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
      pods: await req.app.prometheusService.getAllPods(),
      pendingNotifications: await req.app.notificationStore.getNotSilencedNotifications(),
      currentUrl: req.originalUrl,
      display: req.session.display,
    });
  }
}

export const indexController = new IndexController();
