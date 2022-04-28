import {Notification} from "../model/notification";

export class NotificationManager {
    notificationHandlers: NotificationHandler[] = [];

    addNotificationHandler(handler: NotificationHandler) {
        this.notificationHandlers.push(handler);
    }

    async triggerNotification(notification: Notification) {
        for (const handler of this.notificationHandlers) {
            await handler.onNotification(notification)
        }
    }
}

export interface NotificationHandler {
    onNotification(notification: Notification): Promise<void>;
}
