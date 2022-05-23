import {Request, Response} from "express";
import {ObjectId} from "mongodb";
import {Notification} from "../model/notification";
import {controllerUtil, ControllerUtil} from "../utils/controller-util";
import {BASE_URL} from "../routes/notification-routes";

export class NotificationController {
    constructor(public controllerUtil: ControllerUtil) {
    }

    async getIndex(req: Request, res: Response) {
        let notifications: Notification[] = [];
        try {
            notifications = await req.app.notificationStore.getRecentNotifications();
        } catch (e) {
            this.controllerUtil.setDatabaseAvailability(false);
        }

        const emailSubscribers = await req.app.notificationSubscriberStore.listEmailSubscribers();
        const isServiceConnected = req.app.notificationSubscriberStore.isAvailable();

        const message = req.session.message;
        req.session.message = undefined;
        const messageType = req.session.messageType;
        req.session.messageType = undefined;

        await this.controllerUtil.render("notifications", {
            notifications, emailSubscribers, isServiceConnected, message, messageType
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

        let notification;
        try {
            notification = await req.app.notificationStore.getById(oid);
        } catch (e) {
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
        res.redirect("/");
    }

    async subscribe(req: Request, res: Response) {
        const email = req.body.email;
        try {
            await req.app.notificationSubscriberStore.addEmailSubscriber(email);
            req.session.message = `A confirmation email was sent ${email} and must be confirmed to receive notifications!`;
            req.session.messageType = "info";
        } catch(e) {
            console.log(e);
        }
        res.redirect(BASE_URL);
    }

    async unsubscribe(req: Request, res: Response) {
        const email = req.body.email;
        try {
            await req.app.notificationSubscriberStore.removeEmailSubscriber(email);
        } catch(e) {
            req.session.message = `The email ${email} couldn't be unsubscribed. Make sure you clicked on the link in the confirmation email before trying to unsubscribe because other it won't work. This is an Amazon SNS caveat.`;
            req.session.messageType = "error";
            console.log(e);
        }
        res.redirect(BASE_URL);
    }
}

export const notificationController = new NotificationController(controllerUtil);
