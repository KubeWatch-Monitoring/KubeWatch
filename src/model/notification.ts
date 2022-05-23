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
    getById(id: ObjectId): Promise<Notification>;

    updateNotification(notification: Notification): Promise<void>;

    getRecentNotifications(): Promise<Notification[]>;

    getNotSilencedNotifications(): Promise<Notification[]>;

    createNotification(notification: Notification): Promise<Notification>;
}

export interface NotificationSubscriberStore {
    listEmailSubscribers(): Promise<string[]>;

    addEmailSubscriber(email: string): Promise<void>;

    removeEmailSubscriber(email: string): Promise<void>;

    isAvailable(): boolean;
}
