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
        for (const [name, value] of Object.entries(req.body.name)) {
            const setting = new Setting(name, value);
            await req.app.settingsStore.updateSetting(setting);
        }
        //res.redirect("/settings");
    }
}

export const settingsController = new SettingsController();
