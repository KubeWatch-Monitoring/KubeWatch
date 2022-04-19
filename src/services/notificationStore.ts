import {MongoDbController} from "./mongoDbController";
import {Collection, ObjectId, UpdateResult} from "mongodb";
import {Notification} from "../model/notification";

export interface INotificationStore {
    getById(id: ObjectId): Promise<Notification>;
    updateNotification(notification: Notification): Promise<UpdateResult>;
    getAllNotifications(): Promise<Notification[]>;
    getNotSilencedNotifications(): Promise<Notification[]>;
    createNotification(notification: Notification): Promise<Notification>;
}

export class NotificationStore implements INotificationStore {
    private notificationCollection: Collection;

    constructor(dbController: MongoDbController) {
        this.notificationCollection = dbController.db.collection("notifications");
    }

    async getById(id: ObjectId) {
        const query = { _id: id};
        return await this.notificationCollection.findOne(query) as unknown as Notification;
    }

    async updateNotification(notification: Notification) {
        const query = { _id: notification._id };
        return await this.notificationCollection.updateOne(query, {$set: notification});
    }

    async getAllNotifications() {
        return await this.notificationCollection.find().toArray() as unknown as Notification[];
    }

    async getNotSilencedNotifications() {
        return await this.notificationCollection.find({"isSilenced": false}).toArray() as unknown as Notification[];
    }


    async createNotification(notification: Notification) {
        return await this.notificationCollection.insertOne(notification) as unknown as Notification;
    }


    runInBackground() {
        // TODO: Query Prometheus to query the health state of pods, replicas, etc.
        // - Query prometheus over the PrometheusService.
        //setInterval(async () => {
        //    await this.createNotification(new Notification("My Notification", new Date(), false, ""));
        //}, 10_000);
    }
}
