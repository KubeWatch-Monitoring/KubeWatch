import {Request, Response} from "express";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";
import {ChartSetting} from "../model/chart-setting";
import * as IndexRoutes from "../routes/index-routes";
import { ObjectId } from "mongodb";

export class IndexController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async getIndex(req: Request, res: Response) {
        const {deleteAction, success, failed} = req.query;
        let data = {};

        if (deleteAction !== undefined && success !== undefined) {
            data = Object.assign(data, {successfulDelete: true});
        }
        else if (deleteAction !== undefined && failed !== undefined) {
            data = Object.assign(data, {successfulDelete: false});
        }

        await this.controllerUtil.render("index", data, req, res);
    }

    async getEditDashboard(req: Request, res: Response) {
        // TODO: Use query parameters
        const data = {};
        await this.controllerUtil.render("editDashboard", data, req, res);
    }

    async postEditDashboard(req: Request, res: Response) {
        const ONE_SECOND = 1000;
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
            Math.abs(parseFloat(start)) * -ONE_SECOND,
            Math.abs(parseFloat(end)) * -ONE_SECOND,
            Math.abs(parseFloat(updateInterval)) * ONE_SECOND,
            undefined);

        if (chart.updateInterval < ONE_SECOND || chart.start > 0 || chart.end > 0) {
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

    async deleteCharSetting(req: Request, res: Response) {
        const URL_FAILED = `${IndexRoutes.BASE_URL}?deleteAction&failed`;
        const URL_SUCCESS = `${IndexRoutes.BASE_URL}?deleteAction&success`;

        if (req.body.id === undefined) {
            res.redirect(URL_FAILED);
            return;
        }

        const idParts = req.body.id.toString().split("-");
        if (idParts.length !=2) {
            res.redirect(URL_FAILED);
            return;
        }
        const id = idParts[1];
        let objectId;
        try {
            objectId = new ObjectId(id);
        } catch (e) {
            res.redirect(URL_FAILED);
            return;
        }

        let deleteSuccessful;
        try {
            deleteSuccessful = await req.app.chartSettingStore.deleteChartSetting(objectId);
        } catch(e) {
            this.controllerUtil.setDatabaseAvailability(false);
            res.redirect(URL_FAILED);
            return;
        }

        if (!deleteSuccessful) {
            res.redirect(URL_FAILED);
            return;
        }

        res.redirect(URL_SUCCESS);
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
