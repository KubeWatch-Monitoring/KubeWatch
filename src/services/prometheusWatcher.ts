import {INotificationStore} from "./notificationStore";
import {Notification} from "../model/notification";
import {Health} from "../model/pod";
import {ObjectId} from "mongodb";

const CHECK_INTERVAL_MS = 10_000;

export interface INotificationHandler {
    reactOnNotification(notification: Notification): Promise<void>;
}
export class PrometheusWatcher {
    store: INotificationStore;
    prometheus: any;
    intervalId: NodeJS.Timer | null;
    checkIntervalMs: number;
    eventHandlers: INotificationHandler[];

    constructor(store: INotificationStore, prometheus: any) {
        this.store = store;
        this.prometheus = prometheus;
        this.intervalId = null;
        this.checkIntervalMs = CHECK_INTERVAL_MS;
        this.eventHandlers = [];
    }

    onNotification(handler: INotificationHandler) {
        this.eventHandlers.push(handler);
    }

    private async fireOnNotification(notification: Notification) {
        for (const handler of this.eventHandlers) {
            await handler.reactOnNotification(notification)
        }
    }

    watchPrometheus() {
        this.intervalId = setInterval(async() => {
            const pods = this.prometheus.getAllPods();
            for (const pod of pods) {
                if (pod.health != Health.Running && pod.health != Health.Succeeded) {
                    const message = `Pod {pod.name} is in a bad state ({pod.health})`;
                    const notification = new Notification(message, new Date(), false, "");
                    await this.fireOnNotification(notification);
                }
            }
        }, this.checkIntervalMs);
    }

    stopWatching() {
        if (this.intervalId == null) {
            return;
        }
        clearInterval(this.intervalId);
    }
}
