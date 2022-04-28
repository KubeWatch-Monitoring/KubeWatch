import {ObjectId} from "mongodb";

export class Notification {
    public _id?: ObjectId;
    public isSilenced = false;

    constructor(
        public message: string,
        public date: Date,
        public reason: string,
    ) {
    }
}

export interface NotificationStore {
    getById(id: ObjectId): Promise<Notification>;

    updateNotification(notification: Notification): Promise<void>;

    getAllNotifications(): Promise<Notification[]>;

    getNotSilencedNotifications(): Promise<Notification[]>;

    createNotification(notification: Notification): Promise<Notification>;
}
