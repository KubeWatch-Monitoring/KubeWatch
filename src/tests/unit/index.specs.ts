import { expect } from "chai";
import sinon from "sinon";

import { app } from "../../app";
import {IndexController} from "../../controller/index-controller";
import {NotificationStore} from "../../services/notificationStore";
import {PodStore} from "../../services/podStore";

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

            const podStore = sinon.createStubInstance(PodStore);
            podStore.getAllPods.resolves([]);
            app.podStore = podStore;

            await controller.getIndex(req, res);
            expect(notificationStore.getNotSilencedNotifications.called).to.be.true;
            expect(podStore.getAllPods.called).to.be.true;
            expect(res.render.called).to.be.true;
            expect(res.render.calledWith("index", {
                style: req.session.style,
                pods: [],
                pendingNotifications: [],
                currentUrl: req.originalUrl,
            })).to.be.true;
        });
    });
});
