import {Request, Response} from "express";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";
import {ChartSetting} from "../model/chart-setting";

export class IndexController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async getIndex(req: Request, res: Response) {
        await this.controllerUtil.render("index", {}, req, res);
    }

    async getEditDashboard(req: Request, res: Response) {
        // TODO: Use query parameters
        const data = {};
        await this.controllerUtil.render("editDashboard", data, req, res);
    }

    async postEditDashboard(req: Request, res: Response) {
        const {
            promql,
            title,
            start,
            end,
            updateInterval,
            type
        } = req.body;

        const params = {promql, title, start, end, updateInterval, type};

        if (!this.areAllParamsAvailable(params)) {
            const query = this.paramsToQueryParams(params);
            res.redirect(`/edit${(query.length > 0) ? "?" + query : ""}`);
            return;
        }

        const chart = new ChartSetting(
            title,
            promql,
            parseInt(start),
            parseInt(end),
            parseInt(updateInterval),
            undefined);

        const ONE_SECOND = 1000
        if (chart.updateInterval < ONE_SECOND) {
            const query = this.paramsToQueryParams(params);
            res.redirect(`/edit${(query.length > 0) ? "?" + query : ""}`);
            return;
        }

        await req.app.chartSettingStore.createChartSetting(chart);

        res.redirect("/");
    }

    async getAllChartSettings(req: Request, res: Response) {
        // TODO: Handle absence of db (Wait for ControllerUtil merge)
        const chartSettings = await req.app.chartSettingStore.getAllChartSettings();

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(chartSettings));
    }

    private areAllParamsAvailable(params: object): boolean {
        return Object.values(params).reduce((previous, current) => {
            return previous && (current !== undefined);
        }, true);
    }

    private paramsToQueryParams(params: any): string {
        const query = Object.entries(params).reduce((previous, current) => {
            if (current[1] === undefined) return previous;
            return `${previous}${current[0]}=${current[1]}&`;
        }, "");
        return query.substring(0, query.length-1);
    }
}

export const indexController = new IndexController(controllerUtil);
