import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {Notification} from "../model/notification";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";

export class NotificationController {

    constructor(public controllerUtil: ControllerUtil) {
    }

    async getIndex(req: Request, res: Response) {
        let notifications: Notification[] = [];

        try {
            notifications = await req.app.notificationStore.getAllNotifications();
        } catch (e) {
            this.controllerUtil.setDatabaseAvailability(false);
        }

        await this.controllerUtil.render("listNotifications", {
            notifications,
        }, req, res);
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
            return;
        }

        const notification = await req.app.notificationStore.getById(oid);
        if (notification === null) {
            res.status(404).end();
            return;
        }
        notification.isSilenced = true;
        notification.silenceReason = reason;

        try {
            await req.app.notificationStore.updateNotification(notification);
        } catch (e) {
            res.status(500).end();
            return;
        }
        res.redirect(303, url);
    }

    async trigger(req: Request, res: Response) {
        const {message} = req.body;
        const notification = new Notification(message, new Date());
        await req.app.notificationManager.triggerNotification(notification);
        res.redirect(303, "/");
    }
}

export const notificationController = new NotificationController(controllerUtil);
