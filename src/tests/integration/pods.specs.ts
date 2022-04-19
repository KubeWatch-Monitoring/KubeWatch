import {expect} from "chai";
import {app} from "../../app";
import sinon from "sinon";
import {PodController} from "../../controller/pod-controller";
import {Helpers} from "../test-helper";
import {ObjectId} from "mongodb";
import {Pod} from "../../model/pod";
import {MetricsData} from "../../model/metrics-data";
import {PrometheusService} from "../../services/prometheus-service";

describe("PodController", () => {
    let controller: PodController;
    let prometheusService: any;
    let res: any;

    beforeEach(() => {
        controller = new PodController();
        prometheusService = sinon.createStubInstance(PrometheusService);
        res = Helpers.getMockResponse();
    });

    describe("getIndex", () => {
        it("should return a rendered html page", async () => {
            const req: any = {
                session: {
                    style: {},
                    display: {},
                },
                app
            };

            prometheusService.getAllPods.resolves([]);
            app.prometheusService = prometheusService;

            await controller.getIndex(req, res);
            expect(prometheusService.getAllPods.called).to.be.true;
            expect(res.render.called).to.be.true;
            expect(res.render.calledWith("listPods", {
                style: req.session.style,
                display: req.session.display,
                pods: [],
            })).to.be.true;
        });
    });
    describe("getPod", () => {
        it("should return 400 if id is missing", async () => {
            const req: any = {
                params: {},
                session: {
                    style: {},
                    display: {},
                },
                app
            };

            await controller.getPod(req, res);
            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });
        it("should return 404 if pod is not found", async () => {
            const req: any = {
                params: {
                    id: new ObjectId().toString(),
                },
                session: {
                    style: {},
                    display: {},
                },
                app
            };

            prometheusService.getPodById.resolves(null);
            app.prometheusService = prometheusService;

            await controller.getPod(req, res);
            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(404)).to.be.true;
        });
        it("should return 500 if database error occurs", async () => {
            const req: any = {
                params: {
                    id: new ObjectId().toString(),
                },
                session: {
                    style: {},
                    display: {},
                },
                app
            };

            prometheusService.getPodById.throws()
            app.prometheusService = prometheusService;

            await controller.getPod(req, res);
            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(500)).to.be.true;
        });

        it("should return a rendered html page", async () => {
            const expectedPod = new Pod("3", "name", new MetricsData(1, 2, 3));
            const req: any = {
                params: {
                    id: expectedPod.id,
                },
                session: {
                    style: {},
                    display: {},
                },
                app
            };

            prometheusService.getPodById.resolves(expectedPod)
            app.prometheusService = prometheusService;

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
