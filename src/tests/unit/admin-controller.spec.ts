import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../app";
import {AdminController} from "../../view-controllers/admin-controller";
import {Helpers} from "../test-helper";
import {NotificationStoreImpl} from "../../services/notification-store-impl";
import {ControllerUtil} from "../../utils/controller-util";

describe("AdminController", () => {
    let controller: AdminController;
    let req: any;
    let res: any;
    let notificationStore: any;
    let controllerUtil: any;

    beforeEach(() => {
        res = Helpers.getMockResponse();
        req = Helpers.getMockRequest(app);
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
});
