import {expect} from "chai";
import sinon from "sinon";
import {NotificationStore} from "../../services/notificationStore";
import {PrometheusWatcher} from "../../services/prometheusWatcher";
import {Health, Pod} from "../../model/pod";
import {MetricsData} from "../../model/metrics-data";
import {SettingsStore} from "../../services/settingsStore";


describe("PrometheusWatcher", () => {
    let watcher: PrometheusWatcher;
    let notificationStore: any;
    let settingsStore: any;
    let prometheusService: any;
    let pod: Pod;

    beforeEach(() => {
        notificationStore = sinon.createStubInstance(NotificationStore);
        settingsStore = sinon.createStubInstance(SettingsStore);
        //prometheusService = sinon.createStubInstance({});
    })
    describe("watchPrometheus", () => {
        it("should not create a new notification when everything is fine", async () => {
            pod = new Pod(0, "a", "a", new MetricsData(0, 0, 0));
            pod.health = Health.Running;
            prometheusService = {
                getAllPods: sinon.mock().returns([pod])
            };
            settingsStore.getByName.returns({value: true});
            watcher = new PrometheusWatcher(settingsStore, prometheusService);
            watcher.onNotification(notificationStore);

            watcher.checkIntervalMs = 2;
            watcher.watchPrometheus();

            await new Promise(r => setTimeout(r, 10));

            expect(prometheusService.getAllPods.called).to.be.true;
            expect(notificationStore.createNotification.called).to.be.false;
            watcher.stopWatching();
        });

        it("should create a new notification when something is wrong", async () => {
            pod = new Pod(0, "a", "a", new MetricsData(0, 0, 0));
            pod.health = Health.Failed;
            prometheusService = {
                getAllPods: sinon.mock().returns([pod])
            };
            settingsStore.getByName.returns({value: true});
            watcher = new PrometheusWatcher(settingsStore, prometheusService);
            watcher.onNotification(notificationStore);

            watcher.checkIntervalMs = 2;
            watcher.watchPrometheus();

            await new Promise(r => setTimeout(r, 10));

            expect(prometheusService.getAllPods.called).to.be.true;
            expect(notificationStore.reactOnNotification.called).to.be.true;
            watcher.stopWatching();
        });

        it("should not create a new notification when something is wrong but the notification is disabled", async () => {
            pod = new Pod(0, "a", "a", new MetricsData(0, 0, 0));
            pod.health = Health.Failed;
            prometheusService = {
                getAllPods: sinon.mock().returns([pod])
            };
            settingsStore.getByName.returns({value: false});
            watcher = new PrometheusWatcher(settingsStore, prometheusService);
            watcher.onNotification(notificationStore);

            watcher.checkIntervalMs = 2;
            watcher.watchPrometheus();

            await new Promise(r => setTimeout(r, 10));

            expect(prometheusService.getAllPods.called).to.be.true;
            expect(notificationStore.reactOnNotification.called).to.be.false;
            watcher.stopWatching();
        });
    });
})
