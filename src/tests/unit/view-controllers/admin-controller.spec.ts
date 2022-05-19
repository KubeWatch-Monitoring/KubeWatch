import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../../app";
import {AdminController} from "../../../view-controllers/admin-controller";
import {TestHelper} from "../../test-helper";
import {NotificationStoreImpl} from "../../../services/notification-store-impl";
import {ControllerUtil} from "../../../utils/controller-util";
import {EnvironmentVariables} from "../../../services/env-store-impl";

describe("AdminController", () => {
    let controller: AdminController;
    let req: any;
    let res: any;
    let notificationStore: any;
    let controllerUtil: any;

    beforeEach(() => {
        res = TestHelper.getMockResponse();
        req = TestHelper.getMockRequest(app);
        notificationStore = sinon.createStubInstance(NotificationStoreImpl);
        controllerUtil = sinon.createStubInstance(ControllerUtil);
        controller = new AdminController(controllerUtil);
    })

    describe("getIndex", () => {
        it("should return a rendered html page", async () => {
            req.query = {reconnect: true};
            app.notificationStore = notificationStore;
            notificationStore.getNotSilencedNotifications.resolves([]);

            await controller.getIndex(req, res);
            expect(controllerUtil.setDatabaseAvailability.calledWith(true)).to.be.true;
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWithMatch("admin", {}, req, res)).to.be.true;
        });

        it("should return a rendered html page with database availability set to true when query empty", async () => {
            app.notificationStore = notificationStore;

            await controller.getIndex(req, res);
            expect(controllerUtil.setDatabaseAvailability.calledWith(true)).to.be.true;
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWithMatch("admin", {}, req, res)).to.be.true;
        });
    });

    describe("getPrometheusUrl", () => {
        it("should return configured prometheus url", async () => {
            app.environmentVariables = {
                expressSessionSecret: "",
                mongodbConnectionString: "",
                prometheusConnectionString: "blubblub",
                awsSnsRegion: "",
                awsSnsAccessKeyId: "",
                awsSnsSecretAccessKey: "",
                awsSnsSessionToken: "",
            };
            const expectedValue = {
                url: app.environmentVariables.prometheusConnectionString,
            };
            req.app = app;

            await controller.getPrometheusUrl(req, res);
            expect(res.setHeader.called).to.be.true;
            expect(res.setHeader.calledWith("Content-Type", "application/json")).to.be.true;
            expect(res.end.called).to.be.true;
            expect(res.end.calledWith(JSON.stringify(expectedValue))).to.be.true;
        });
    });
});
