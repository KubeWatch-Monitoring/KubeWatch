import {MongoDbService} from "./mongo-db-service";
import {Collection, ObjectId} from "mongodb";
import {Notification, NotificationStore} from "../model/notification";
import {NotificationHandler} from "../domain/prometheus-watcher";

export class NotificationStoreImpl implements NotificationStore, NotificationHandler {
    private notificationCollection: Collection;

    constructor(mongoDbService: MongoDbService) {
        this.notificationCollection = mongoDbService.db.collection("notifications");
    }

    async getById(id: ObjectId) {
        const query = {_id: id};
        return await this.notificationCollection.findOne(query) as unknown as Notification;
    }

    async updateNotification(notification: Notification) {
        const query = {_id: notification._id};
        await this.notificationCollection.updateOne(query, {$set: notification});
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

    async reactOnNotification(notification: Notification): Promise<void> {
        await this.createNotification(notification);
    }
}
