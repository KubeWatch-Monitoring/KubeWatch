import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../../app";
import {NotificationController} from "../../../view-controllers/notification-controller";
import {Notification} from "../../../model/notification";
import {ObjectId} from "mongodb";
import {PrometheusService} from "../../../services/prometheus-service";
import {NotificationStoreImpl} from "../../../services/notification-store-impl";
import {AmazonSnsServiceProxy} from "../../../services/amazon-sns-service";
import {ControllerUtil} from "../../../utils/controller-util";
import {TestHelper} from "../../test-helper";


describe("NotificationController", () => {
    let controller: NotificationController;
    let notificationStore: any;
    let notificationSubscriberStore: any;
    let prometheusService: any;
    let controllerUtil: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        controllerUtil = sinon.createStubInstance(ControllerUtil);
        notificationStore = sinon.createStubInstance(NotificationStoreImpl);
        notificationSubscriberStore = sinon.createStubInstance(AmazonSnsServiceProxy);
        prometheusService = sinon.createStubInstance(PrometheusService);
        controller = new NotificationController(controllerUtil);

        req = TestHelper.getMockRequest(app);
        res = TestHelper.getMockResponse()

    })
    describe("index", () => {
        it("should return a rendered html page", async () => {
            notificationStore.getNotSilencedNotifications.resolves([]);
            notificationStore.getRecentNotifications.resolves([]);
            app.notificationStore = notificationStore;
            app.notificationSubscriberStore = notificationSubscriberStore;
            prometheusService.getAllPods.resolves([]);

            await controller.getIndex(req, res);
            expect(notificationStore.getRecentNotifications.called).to.be.true;
            expect(controllerUtil.render.called).to.be.true;
        });

        it("should return a rendered html page but database availability set to false", async () => {
            notificationStore.getNotSilencedNotifications.rejects();
            notificationStore.getRecentNotifications.rejects();
            app.notificationStore = notificationStore;
            prometheusService.getAllPods.resolves([]);

            await controller.getIndex(req, res);
            expect(notificationStore.getRecentNotifications.called).to.be.true;
            expect(controllerUtil.setDatabaseAvailability.calledWith(false)).to.be.true;
            expect(controllerUtil.render.called).to.be.true;
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
        it("should return 404 when notification is not found", async () => {
            const req: any = {
                body: {
                    id: new ObjectId(),
                    reason: "some reason",
                    url: "/",
                },
                app
            };
            const store = sinon.createStubInstance(NotificationStoreImpl);
            store.getById.throws();
            app.notificationStore = store;
            await controller.silenceNotification(req, res);

            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
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

            const originalNotification = new Notification(message, date);

            const updatedNotification = new Notification(message, date);
            updatedNotification.isSilenced = true;
            updatedNotification.silenceReason = "some reason";

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
