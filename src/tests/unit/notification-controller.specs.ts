import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../app";
import {NotificationController} from "../../view-controllers/notification-controller";
import {Notification} from "../../model/notification";
import {ObjectId} from "mongodb";
import {PrometheusService} from "../../services/prometheus-service";
import {NotificationStoreImpl} from "../../services/notification-store-impl";


describe("NotificationController", () => {
    let controller: NotificationController;
    let notificationStore: any;
    let prometheusService: any;
    let res: any;

    beforeEach(() => {
        controller = new NotificationController();
        notificationStore = sinon.createStubInstance(NotificationStoreImpl);
        prometheusService = sinon.createStubInstance(PrometheusService);

        res = {
            status: {},
            end: sinon.spy(),
            redirect: sinon.spy(),
        };
        res.status = sinon.mock().returns(res);

    })
    describe("index", () => {
        const URL = "/";
        it("should return a rendered html page", async () => {
            const req: any = {
                pendingNotifications: [],
                notifications: [],
                originalUrl: URL,
                app
            };
            const res: any = {
                render: sinon.spy()
            };

            notificationStore.getNotSilencedNotifications.resolves([]);
            notificationStore.getAllNotifications.resolves([]);
            app.notificationStore = notificationStore;

            prometheusService.getAllPods.resolves([]);

            await controller.getIndex(req, res);
            expect(notificationStore.getNotSilencedNotifications.called).to.be.true;
            expect(notificationStore.getAllNotifications.called).to.be.true;
            expect(res.render.called).to.be.true;
            expect(res.render.calledWith("listNotifications", {
                pendingNotifications: [],
                notifications: [],
                currentUrl: req.originalUrl,
            })).to.be.true;
        });
    });
    describe("silenceNotification", () => {
        it("should return 400 when missing id", async () => {
            const req: any = {
                body: {
                    reason: "some reason",
                    url: "/"
                }
            };
            await controller.silenceNotification(req, res);

            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });
        it("should return 400 when missing reason", async () => {
            const req: any = {
                body: {
                    id: new ObjectId().toString(),
                    url: "/"
                }
            };
            await controller.silenceNotification(req, res);

            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });
        it("should return 400 when missing url", async () => {
            const req: any = {
                body: {
                    id: new ObjectId().toString(),
                    reason: "some reason",
                }
            };
            await controller.silenceNotification(req, res);

            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });
        it("should return 400 when id is ill formatted", async () => {
            const req: any = {
                body: {
                    id: "my-wrong-formatted-id",
                    reason: "some reason",
                    url: "/",
                }
            };
            await controller.silenceNotification(req, res);

            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });
        it("should return 303 and silence the notification", async () => {
            const message = "some message";
            const date = new Date();
            const req: any = {
                body: {
                    id: new ObjectId().toString(),
                    reason: "some reason",
                    url: "/",
                },
                app
            };

            const originalNotification = new Notification(
                message,
                date,
                "",
            );

            const updatedNotification = new Notification(
                message,
                date,
                req.body.reason,
            );
            updatedNotification.isSilenced = true;

            const store = sinon.createStubInstance(NotificationStoreImpl);
            store.getById.resolves(originalNotification);
            store.updateNotification.resolves();
            app.notificationStore = store;

            await controller.silenceNotification(req, res);

            expect(store.getById.called).to.be.true;
            expect(store.getById.calledWith(new ObjectId(req.body.id))).to.be.true;
            expect(store.updateNotification.called).to.be.true;
            expect(store.updateNotification.calledWith(updatedNotification)).to.be.true;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith(303, req.body.url)).to.be.true;
        });
    })
})
