import {expect} from "chai";
import sinon from "sinon";
import {NotificationStoreImpl} from "../../services/notification-store-impl";
import {ThresholdMonitor} from "../../domain/threshold-monitor";
import {Pod} from "../../model/pod";
import {MetricsData} from "../../model/metrics-data";
import {SettingStoreImpl} from "../../services/setting-store-impl";
import {NotificationManager} from "../../domain/notification-manager";
import {before} from "mocha";
import {PodStoreImpl} from "../../services/pod-store-impl";


describe("ThresholdMonitor", () => {
    let clock: sinon.SinonFakeTimers;
    let thresholdMonitor: ThresholdMonitor;
    let notificationStore: any;
    let settingsStore: any;
    let notificationManager: any;
    let podStore: any;
    let pod: Pod;


    before(() => {
        clock = sinon.useFakeTimers();
    })
    beforeEach(() => {
        notificationStore = sinon.createStubInstance(NotificationStoreImpl);
        settingsStore = sinon.createStubInstance(SettingStoreImpl);
        podStore = sinon.createStubInstance(PodStoreImpl);
        notificationManager = sinon.createStubInstance(NotificationManager);
        notificationManager.addNotificationHandler(notificationStore);
        thresholdMonitor = new ThresholdMonitor(settingsStore, podStore, notificationManager);
        thresholdMonitor.monitorPods();
        pod = new Pod("a", "a", new MetricsData(0, 0, 0));
    })
    describe("monitorPods", () => {
        it("should not trigger a notification if pods are running", async () => {
            pod.health = "Running"
            podStore.getAllPods.returns([pod]);
            settingsStore.getByName.returns({value: true});
            await clock.nextAsync();
            expect(notificationManager.triggerNotification.called).to.be.false;
            thresholdMonitor.stopMonitoringPods();
        });

        it("should trigger a notification if pods have failed", async () => {
            pod.health = "Failed"
            podStore.getAllPods.returns([pod]);
            settingsStore.getByName.returns({value: true});
            await clock.nextAsync();
            expect(notificationManager.triggerNotification.called).to.be.true;
        });

        it("should not trigger a notification if something is wrong but the notification is disabled", async () => {
            pod.health = "Failed"
            podStore.getAllPods.returns([pod]);
            settingsStore.getByName.returns({value: false});
            await clock.nextAsync();
            expect(notificationManager.triggerNotification.called).to.be.false;
        });
    });
    afterEach(() => {
        thresholdMonitor.stopMonitoringPods();
    });
    after(() => {
        clock.restore();
    });
})
