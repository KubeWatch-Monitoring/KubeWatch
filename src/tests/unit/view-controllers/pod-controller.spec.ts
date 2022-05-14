import {expect} from "chai";
import {app} from "../../../app";
import sinon from "sinon";
import {PodController} from "../../../view-controllers/pod-controller";
import {TestHelper} from "../../test-helper";
import {ObjectId} from "mongodb";
import {Pod} from "../../../model/pod";
import {MetricsData} from "../../../model/metrics-data";
import {PrometheusService} from "../../../services/prometheus-service";
import {PodStoreImpl} from "../../../services/pod-store-impl";
import {ControllerUtil} from "../../../utils/controller-util";

describe("PodController", () => {
    let controller: PodController;
    let prometheusService: any;
    let controllerUtil: any;
    let res: any;
    let req: any;

    beforeEach(() => {
        prometheusService = sinon.createStubInstance(PrometheusService);
        controllerUtil = sinon.createStubInstance(ControllerUtil);
        app.podStore = new PodStoreImpl(prometheusService);
        res = TestHelper.getMockResponse();
        req = TestHelper.getMockRequest(app);
        controller = new PodController(controllerUtil);
    });

    describe("getIndex", () => {
        it("should return a rendered html page", async () => {
            prometheusService.getAllPods.resolves([]);

            await controller.getIndex(req, res);
            expect(prometheusService.getAllPods.called).to.be.true;
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWith("listPods", {
                pods: [],
            })).to.be.true;
        });
    });
    describe("getPod", () => {
        it("should return 400 if id is missing", async () => {
            await controller.getPod(req, res);
            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });
        it("should return 404 if pod is not found", async () => {
            req.params = {
                id: new ObjectId().toString(),
            }
            prometheusService.getPodById.resolves(null);

            await controller.getPod(req, res);
            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
        });
        it("should return 500 if database error occurs", async () => {
            req.params = {
                id: new ObjectId().toString(),
            }
            prometheusService.getPodById.throws(new Error())

            await controller.getPod(req, res);
            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
        });

        it("should return a rendered html page", async () => {
            const expectedPod = new Pod("3", "name", new MetricsData(1, 2, 3));
            req.params = {
                id: expectedPod.id.toString(),
            }
            prometheusService.getPodById.resolves(expectedPod)

            await controller.getPod(req, res);
            expect(res.render.called).to.be.true;
            expect(res.render.calledWith("podView", {
                style: req.session.style,
                display: req.session.display,
                pod: expectedPod,
            })).to.be.true;
        });
    });
});
