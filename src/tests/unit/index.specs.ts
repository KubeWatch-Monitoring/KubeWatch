import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../app";
import {IndexController} from "../../view-controllers/index-controller";
import {NotificationStoreImpl} from "../../services/notification-store-impl";
import {PodStoreImpl} from "../../services/pod-store-impl";

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

            const notificationStore = sinon.createStubInstance(NotificationStoreImpl);
            notificationStore.getNotSilencedNotifications.resolves([]);
            app.notificationStore = notificationStore;

            const podStore = sinon.createStubInstance(PodStoreImpl);
            app.podStore = podStore;
            podStore.getAllPods.resolves([]);

            await controller.getIndex(req, res);
            expect(notificationStore.getNotSilencedNotifications.called).to.be.true;
            expect(podStore.getAllPods.called).to.be.true;
            expect(res.render.called).to.be.true;
            expect(res.render.calledWithMatch("index", {
                pods: [],
                pendingNotifications: [],
                currentUrl: req.originalUrl,
            })).to.be.true;
        });
    });
});
