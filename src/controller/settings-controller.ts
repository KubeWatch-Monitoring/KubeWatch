import {Request, Response} from "express";
import {Setting} from "../model/setting";

export class SettingsController {
    async getSettings(req: Request, res: Response) {
        res.render("settings", {
            settings: await req.app.settingsStore.getSettings(),
            pendingNotifications: await req.app.notificationStore.getNotSilencedNotifications(),
            notifications: await req.app.notificationStore.getAllNotifications(),
            currentUrl: req.originalUrl,
        });
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
            const setting = new Setting(name, value);
            await req.app.settingsStore.updateSetting(setting);
        }
        res.redirect("/settings", 303);
    }
}

export const settingsController = new SettingsController();
