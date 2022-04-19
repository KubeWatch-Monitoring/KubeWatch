import {Notification} from "../model/notification";
import {SettingStore} from "./setting-store";
import {PrometheusService} from "./prometheus-service";

const CHECK_INTERVAL_MS = 10_000;

export interface INotificationHandler {
    reactOnNotification(notification: Notification): Promise<void>;
}

export class PrometheusWatcher {
    store: SettingStore;
    prometheus: PrometheusService;
    intervalId: NodeJS.Timer | null;
    checkIntervalMs: number;
    eventHandlers: INotificationHandler[];

    constructor(store: SettingStore, prometheus: PrometheusService) {
        this.store = store;
        this.prometheus = prometheus;
        this.intervalId = null;
        this.checkIntervalMs = CHECK_INTERVAL_MS;
        this.eventHandlers = [];
    }

    onNotification(handler: INotificationHandler) {
        this.eventHandlers.push(handler);
    }

    watchPrometheus() {
        this.intervalId = setInterval(async () => {
            const pods = await this.prometheus.getAllPods();
            for (const pod of pods) {
                if (pod.health != "Running" && pod.health != "Succeeded") {
                    const message = `Pod ${pod.name} is in a bad state (${pod.health})`;
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

    async fireManually(notification: Notification) {
        await this.fireOnNotification(notification);
    }

    private async fireOnNotification(notification: Notification) {
        if (!await this.isNotificationEnabled()) {
            return;
        }
        for (const handler of this.eventHandlers) {
            await handler.reactOnNotification(notification)
        }
    }

    private async isNotificationEnabled(): Promise<boolean> {
        const setting = await this.store.getByName("isNotificationEnabled", true);
        return setting.value;
    }
}
