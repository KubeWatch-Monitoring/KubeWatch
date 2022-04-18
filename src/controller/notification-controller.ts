import {Request, Response} from "express";
import {ObjectId} from "mongodb";

export class NotificationController {
    async getIndex(req: Request, res: Response) {
        res.render("listNotifications", {
            pendingNotifications: await req.app.notificationStore.getNotSilencedNotifications(),
            notifications: await req.app.notificationStore.getAllNotifications(),
            currentUrl: req.originalUrl,
        });
    }

    async silenceNotification(req: Request, res: Response) {
        const {id, reason, url} = req.body;

        if (id == undefined || reason == undefined || url == undefined) {
            res.status(400).end();
            return;
        }

        let oid;
        try {
            oid = new ObjectId(id);
        } catch (e) {
            res.status(400).end();
            return
        }

        const notification = await req.app.notificationStore.getById(oid);
        notification.isSilenced = true;
        notification.reason = reason;

        try {
            const a = await req.app.notificationStore.updateNotification(notification);
        } catch (e) {
            res.status(500).end();
            return;
        }
        res.redirect(url, 303);
    }
}

export const notificationController = new NotificationController();