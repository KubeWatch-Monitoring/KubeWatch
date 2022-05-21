import {ObjectId} from "mongodb";
import {NotificationHandler} from "../domain/notification-manager";
import {Reconnectable} from "../services/reconnectable";

export class Notification {
    public _id?: ObjectId;
    public isSilenced = false;
    public silenceReason?: string;

    constructor(
        public message: string,
        public date: Date,
    ) {
    }
}

export interface NotificationStore extends NotificationHandler, Reconnectable {
    // TODO Instead of possibly returning null it might make more sense to throw an error if not notification was found
    getById(id: ObjectId): Promise<Notification | null>;

    updateNotification(notification: Notification): Promise<void>;

    getAllNotifications(): Promise<Notification[]>;

    getNotSilencedNotifications(): Promise<Notification[]>;

    createNotification(notification: Notification): Promise<Notification>;
}
