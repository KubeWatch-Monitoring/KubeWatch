import {MongoDbService} from "../services/mongo-db-service";
import {Collection, ObjectId} from "mongodb";
import {Notification, NotificationStore} from "../model/notification";
import {NotificationHandler} from "../domain/notification-manager";

export class NotificationStoreImpl implements NotificationStore, NotificationHandler {
    private notificationCollection: Collection;

    constructor(private mongoDbService: MongoDbService) {
        this.notificationCollection = mongoDbService.db.collection("notifications");
    }

    async getById(id: ObjectId) {
        const query = {_id: id};
        const result = await this.notificationCollection.findOne(query);
        if(result == null)
            throw new Error("There is no notification with the ID " + id.toString())
        return result as unknown as Notification;
    }

    async updateNotification(notification: Notification) {
        const query = {_id: notification._id};
        await this.notificationCollection.updateOne(query, {$set: notification});
    }

    async getRecentNotifications() {
        return this.notificationCollection.find().toArray() as unknown as Notification[];
    }

    async getNotSilencedNotifications() {
        return this.notificationCollection.find({"isSilenced": false}).toArray() as unknown as Notification[];
    }

    async createNotification(notification: Notification) {
        return await this.notificationCollection.insertOne(notification) as unknown as Notification;
    }

    async onNotification(notification: Notification): Promise<void> {
        await this.createNotification(notification);
    }

    async reconnect() {
        await this.mongoDbService.reconnect();
    }
}
