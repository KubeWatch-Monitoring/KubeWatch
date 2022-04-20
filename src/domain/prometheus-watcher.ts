import {Notification} from "../model/notification";
import {SettingStore} from "../model/setting";
import {PodStore} from "../model/pod";

const CHECK_INTERVAL_MS = 10_000;

export interface NotificationHandler {
    reactOnNotification(notification: Notification): Promise<void>;
}

export class PrometheusWatcher {
    intervalId: NodeJS.Timer | null = null;
    checkIntervalMs: number = CHECK_INTERVAL_MS;
    eventHandlers: NotificationHandler[] = [];

    constructor(
        public settingStore: SettingStore,
        public podStore: PodStore,
    ) {
    }

    onNotification(handler: NotificationHandler) {
        this.eventHandlers.push(handler);
    }

    watchPrometheus() {
        this.intervalId = setInterval(async () => {
            const pods = await this.podStore.getAllPods();
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
        const setting = await this.settingStore.getByName("isNotificationEnabled", true);
        return setting.value;
    }
}
