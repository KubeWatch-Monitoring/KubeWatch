import {Request, Response} from "express";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";
import {Metric} from "prometheus-query";

export class PrometheusController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async getMetrics(req: Request, res: Response) {
        let rangeMetrics = [];
        let instantMetrics = [];
        let seriesMetrics: Metric[] = [];
        try {
            rangeMetrics = await req.app.podStore.testRangeQuery();
            instantMetrics = await req.app.podStore.testInstantQuery();
            seriesMetrics = await req.app.podStore.testSeriesQuery();
        }
        catch (e) {
            this.controllerUtil.setDatabaseAvailability(false);
        }
        await this.controllerUtil.render("promView", {
            rangeMetrics,
            instantMetrics,
            seriesMetrics,
        }, req, res);
    }
}

export const prometheusController = new PrometheusController(controllerUtil);
