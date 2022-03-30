import { Request, Response } from "express";
import promClient from "prom-client";

export class PrometheusController {
  async getMetrics(req: Request, res: Response) {
    res.setHeader("Content-Type", register.contentType);
    res.send(await register.metrics());
    // res.send(await fetch("http://localhost:9100/metrics")); // does not yet work..
    // res.render("promView", {
    //   style: req.session.style,
    //   display: req.session.display,
    //   promMetrics: await register.metrics(),
    // });
  }
}

export const promController = new PrometheusController();

const register = new promClient.Registry();
register.setDefaultLabels({
  app: "monitoring-kubewatch",
});
promClient.collectDefaultMetrics({ register });
