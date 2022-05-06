import {Request, Response} from "express";
import {castValue, Setting} from "../model/setting";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";

export class SettingsController {
    controllerUtil: ControllerUtil;

    constructor(controllerUtil: ControllerUtil) {
        this.controllerUtil = controllerUtil;
    }

    async getSettings(req: Request, res: Response) {
        let settings: Setting[] = [];

        try {
            settings = await req.app.settingsStore.getSettings();
        } catch (e) {
            this.controllerUtil.setDatabaseAvailability(false);
        }

        await this.controllerUtil.render("settings", {
            settings,
        }, req, res);
    }

    async updateSetting(req: Request, res: Response) {
        if (req.body.setting === undefined) {
            res.status(400).end();
            return;
        }

        if (Array.isArray(req.body.setting)) {
            res.status(400).end();
            return;
        }

        for (const [name, value] of Object.entries(req.body.setting)) {
            if (name === undefined || value === undefined) {
                res.status(400).end();
                return;
            }
            const setting = await req.app.settingsStore.getByName(name, "");
            setting.value = castValue(value, setting.type);
            await req.app.settingsStore.updateSetting(setting);
        }
        res.redirect("/settings", 303);
    }
}

export const settingsController = new SettingsController(controllerUtil);
