import {Request, Response} from "express";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";
import * as DbAvailabilityRoutes from "../routes/db-availability-routes";

export class DbAvailabilityController {
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
            res.redirect(`${DbAvailabilityRoutes.BASE_URL}/?reconnect=false`);
            return;
        }
        res.redirect(`${DbAvailabilityRoutes.BASE_URL}/?reconnect=true`);
    }
}

export const dbAvailabilityController = new DbAvailabilityController(controllerUtil);
