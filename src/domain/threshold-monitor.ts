import {Notification} from "../model/notification";
import {PodStore} from "../model/pod";
import {NotificationManager} from "./notification-manager";
import {SettingStore} from "../model/setting";

export class ThresholdMonitor {
    public static readonly CHECK_INTERVAL_MS: number = 10_000;
    intervalId?: NodeJS.Timer;

    constructor(
        public settingStore: SettingStore,
        public podStore: PodStore,
        public notificationManager: NotificationManager,
    ) {
    }

    monitorPods() {
        if (!this.intervalId) {
            this.intervalId = setInterval(this.checkPods.bind(this), ThresholdMonitor.CHECK_INTERVAL_MS);
        }
    }

    private async checkPods() {
        const pods = await this.podStore.getAllPods();
        for (const pod of pods) {
            if (pod.health == "Failed" && await this.isNotificationEnabled()) {
                const message = `Pod ${pod.name} has failed`;
                const notification = new Notification(message, new Date(), "");
                await this.notificationManager.triggerNotification(notification);
            }
        }
    }

    private async isNotificationEnabled(): Promise<boolean> {
        const setting = await this.settingStore.getByName("isNotificationEnabled", true);
        return setting.value;
    }

    stopMonitoringPods() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined;
        }
    }
}
