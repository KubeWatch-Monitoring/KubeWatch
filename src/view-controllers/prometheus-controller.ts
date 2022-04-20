import {Request, Response} from "express";

export class PrometheusController {
    async getMetrics(req: Request, res: Response) {
        res.render("promView", {
            style: req.session.style,
            display: req.session.display,
            rangeMetrics: await req.app.podStore.testRangeQuery(),
            instantMetrics: await req.app.podStore.testInstantQuery(),
            seriesMetrics: await req.app.podStore.testSeriesQuery(),
        });
    }
}

export const prometheusController = new PrometheusController();
