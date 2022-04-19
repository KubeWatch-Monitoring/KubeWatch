import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../app";
import {IndexController} from "../../controller/index-controller";
import {PrometheusService} from "../../services/prometheus-service";
import {NotificationStore} from "../../services/notification-store";

describe("IndexController", () => {
    let controller: IndexController;
    describe("getIndex", () => {
        beforeEach(() => {
            controller = new IndexController();
        });

        const URL = "/";
        it("should return a rendered html page", async () => {
            const req: any = {
                session: {},
                display: {},
                originalUrl: URL,
                app
            };
            const res: any = {
                render: sinon.spy()
            };

            const notificationStore = sinon.createStubInstance(NotificationStore);
            notificationStore.getNotSilencedNotifications.resolves([]);
            app.notificationStore = notificationStore;

            const prometheusService = sinon.createStubInstance(PrometheusService);
            prometheusService.getAllPods.resolves([]);
            app.prometheusService = prometheusService;

            await controller.getIndex(req, res);
            expect(notificationStore.getNotSilencedNotifications.called).to.be.true;
            expect(prometheusService.getAllPods.called).to.be.true;
            expect(res.render.called).to.be.true;
            expect(res.render.calledWithMatch("index", {
                pods: [],
                pendingNotifications: [],
                currentUrl: req.originalUrl,
            })).to.be.true;
        });
    });
});
