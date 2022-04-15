import chai, { expect } from "chai";
import sinon from "sinon";
import { app } from "../../app";
import {NotificationController} from "../../controller/notification-controller";
import {Notification} from "../../model/notification";
import {ObjectId} from "mongodb";
import {NotificationStore} from "../../services/notificationStore";
import {PodStore} from "../../services/podStore";


describe("NotificationController", () => {
    let controller: NotificationController;
    let notificationStore: any;
    let podStore: any;
    let res: any;

    beforeEach(() => {
        controller = new NotificationController();
        notificationStore = sinon.createStubInstance(NotificationStore);
        podStore = sinon.createStubInstance(PodStore);

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

            podStore.getAllPods.resolves([]);
            app.podStore = podStore;

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
        it ("should return 400 when missing id", async () => {
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
        it ("should return 400 when missing reason", async () => {
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
        it ("should return 400 when missing url", async () => {
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
        it ("should return 400 when id is ill formatted", async () => {
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
                false,
                "",
                new ObjectId(req.body.id));

            const updatedNotification = new Notification(
                message,
                date,
                true,
                req.body.reason,
                new ObjectId(req.body.id));

            const store = sinon.createStubInstance(NotificationStore);
            store.getById.resolves(originalNotification);
            store.updateNotification.resolves({});
            app.notificationStore = store;

            await controller.silenceNotification(req, res);

            expect(store.getById.called).to.be.true;
            expect(store.getById.calledWith(new ObjectId(req.body.id))).to.be.true;
            expect(store.updateNotification.called).to.be.true;
            expect(store.updateNotification.calledWith(updatedNotification)).to.be.true;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith(req.body.url, 303)).to.be.true;
        });
    })
})
