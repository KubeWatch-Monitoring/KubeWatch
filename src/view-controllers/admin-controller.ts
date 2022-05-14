import {Request, Response} from "express";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";
import * as AdminRoutes from "../routes/admin-routes";

export class AdminController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async getIndex(req: Request, res: Response) {
        const {reconnect} = req.query;
        const availability = reconnect === undefined || reconnect
        this.controllerUtil.setDatabaseAvailability(availability as boolean);
        await this.controllerUtil.render("admin", {}, req, res);
    }

    async reconnect(req: Request, res: Response) {
        try {
            await req.app.notificationStore.reconnect();
            await req.app.settingsStore.reconnect();
            await req.app.chartSettingStore.reconnect();
        } catch (e) {
            res.redirect(`${AdminRoutes.BASE_URL}/?reconnect=false`);
            return;
        }
        res.redirect(`${AdminRoutes.BASE_URL}/?reconnect=true`);
    }

    async getPrometheusUrl(req: Request, res: Response) {
        const value = {
            // TODO: Retrieve from env variables
            url: "http://127.0.0.1:9090"
        };
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(value));
    }
}

export const adminController = new AdminController(controllerUtil);
