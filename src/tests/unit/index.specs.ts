import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../app";
import {IndexController} from "../../view-controllers/index-controller";
import {PodStoreImpl} from "../../services/pod-store-impl";
import {ControllerUtil} from "../../utils/controller-util";
import {Helpers} from "../test-helper";

describe("IndexController", () => {
    let controller: IndexController;
    let controllerUtil: any;
    let req: any;
    let res: any;

    describe("getIndex", () => {
        beforeEach(() => {
            controllerUtil = sinon.createStubInstance(ControllerUtil);
            controller = new IndexController(controllerUtil);
            req = Helpers.getMockRequest(app)
            res = Helpers.getMockRequest(app)
        });

        const URL = "/";
        it("should return a rendered html page", async () => {
            const podStore = sinon.createStubInstance(PodStoreImpl);
            await controller.getIndex(req, res);
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWithMatch("index", sinon.match({}))).to.be.true;
        });
    });
});
