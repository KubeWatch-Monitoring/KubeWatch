import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../../app";
import {IndexController} from "../../../view-controllers/index-controller";
import {ControllerUtil} from "../../../utils/controller-util";
import {TestHelper} from "../../test-helper";
import {ChartSettingStoreImpl} from "../../../stores/chart-setting-store-impl";
import {ChartSetting} from "../../../model/chart-setting";
import {ObjectId} from "mongodb";

describe("IndexController", () => {
    let controller: IndexController;
    let controllerUtil: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        controllerUtil = sinon.createStubInstance(ControllerUtil);
        controller = new IndexController(controllerUtil);
        req = TestHelper.getMockRequest(app);
        res = TestHelper.getMockResponse();
    });

    describe("getIndex", () => {
        it("should return a rendered html page without delete message when no query params are available", async () => {
            await controller.getIndex(req, res);
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWith("index", {})).to.be.true;
        });
        it("should return a rendered html page with successful delete message when query indicates it", async () => {
            req.query = {
                deleteAction: "",
                success: ""
            };

            await controller.getIndex(req, res);
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWith("index", {successfulDelete: true})).to.be.true;
        });
        it("should return a rendered html page with unsuccessful delete message when query indicates it", async () => {
            req.query = {
                deleteAction: "",
                failed: ""
            };

            await controller.getIndex(req, res);
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWith("index", {successfulDelete: false})).to.be.true;
        });
    });
    describe("getEditDashboard", () => {
        it("should return a rendered html page", async () => {
            await controller.getEditDashboard(req, res);

            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWith("editDashboard", {})).to.be.true;
        });
        //it("should return a rendered html page with query parameters", async () => {
        //    const req: any = {
        //        query: {
        //            promql: "query",
        //            title: "title",
        //            start: "0",
        //            end: "0",
        //            updateInterval: "0",
        //            type: "relative",
        //        },
        //        app
        //    };
        //    const res: any = Helpers.getMockResponse();

        //    await controller.getEditDashboard(req, res);

        //    expect(res.render.called).to.be.true;
        //    expect(res.render.calledWith("editDashboard", req.query)).to.be.true;
        //});
    });
    describe("postEditDashboard", () => {
        it("should create a new ChartSetting in the database", async () => {
            const chart = new ChartSetting("title", "query", -1800, -0, 5000, undefined);
            req.body = {
                promql: chart.promql,
                title: chart.title,
                start: (-1*(chart.start)/1000).toString(),
                end: (-1*(chart.end)/1000).toString(),
                updateInterval: ((chart.updateInterval)/1000).toString(),
                type: "relative",
            };
            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            app.chartSettingStore = chartSettingStore;

            await controller.postEditDashboard(req, res);

            expect(chartSettingStore.createChartSetting.called).to.be.true;
            expect(chartSettingStore.createChartSetting.calledWith(chart)).to.be.true;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith("/")).to.be.true;
        });
        it("should redirect to edit page", async () => {
            const req: any = {
                body: {},
                app
            };
            const res: any = TestHelper.getMockResponse();
            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            app.chartSettingStore = chartSettingStore;

            await controller.postEditDashboard(req, res);

            expect(chartSettingStore.createChartSetting.called).to.be.false;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith("/edit")).to.be.true;
        });
        it("should redirect to edit page with the given params as query params", async () => {
            const req: any = {
                body: {
                    promql: "my query"
                },
                app
            };
            const res: any = TestHelper.getMockResponse();
            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            app.chartSettingStore = chartSettingStore;

            await controller.postEditDashboard(req, res);

            expect(chartSettingStore.createChartSetting.called).to.be.false;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith("/edit?promql=my query")).to.be.true;
        });
    });
    describe('getAllChartSettings', function () {
        it("should return an array with ChartSettings", async () => {
            const settings = [
                new ChartSetting("title1", "query1", 0, 0, 0, new ObjectId()),
                new ChartSetting("title2", "query2", 0, 0, 0, new ObjectId()),
                new ChartSetting("title3", "query3", 0, 0, 0, new ObjectId()),
                new ChartSetting("title4", "query4", 0, 0, 0, new ObjectId()),
            ];
            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            chartSettingStore.getAllChartSettings.resolves(settings);
            app.chartSettingStore = chartSettingStore;

            await controller.getAllChartSettings(req, res);

            expect(chartSettingStore.getAllChartSettings.called).to.be.true;
            expect(res.end.called).to.be.true;
            expect(res.end.calledWith(JSON.stringify(settings))).to.be.true;
        });
        it("should return an empty array when no settings in database", async () => {
            const settings: ChartSetting[] = [];
            const req: any = {
                app
            };
            const res: any = TestHelper.getMockResponse();
            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            chartSettingStore.getAllChartSettings.resolves(settings);
            app.chartSettingStore = chartSettingStore;

            await controller.getAllChartSettings(req, res);

            expect(chartSettingStore.getAllChartSettings.called).to.be.true;
            expect(res.end.called).to.be.true;
            expect(res.end.calledWith(JSON.stringify(settings))).to.be.true;
        });
        it("should return you to the edit page when parameters are invalid", async () => {
            const chart = new ChartSetting("title", "query", 0, 0, 0, undefined);
            req.body = {
                promql: chart.promql,
                title: chart.title,
                start: chart.start.toString(),
                end: chart.end.toString(),
                updateInterval: chart.end.toString(),
                type: "relative",
            };
            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            app.chartSettingStore = chartSettingStore;

            await controller.postEditDashboard(req, res);

            expect(chartSettingStore.createChartSetting.called).to.be.false;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWithMatch("/edit")).to.be.true;
        });
    });
    describe('deleteCharSetting', () => {
        it("should delete the char setting with the given id from the database", async () => {
            const id = new ObjectId();
            req.body = {
                id: `chart-${id.toString()}`,
            };

            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            app.chartSettingStore = chartSettingStore;
            chartSettingStore.deleteChartSetting.resolves(true);

            await controller.deleteCharSetting(req, res);

            expect(chartSettingStore.deleteChartSetting.called).to.be.true;
            expect(chartSettingStore.deleteChartSetting.calledWith(id)).to.be.true;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith("/?deleteAction&success")).to.be.true;
        });
        it("should redirect with query parameters when chart id has wrong format", async () => {
            const id = new ObjectId();
            req.body = {
                id: `${id.toString()}`,
            };

            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            app.chartSettingStore = chartSettingStore;
            chartSettingStore.deleteChartSetting.resolves(false);

            await controller.deleteCharSetting(req, res);

            expect(chartSettingStore.deleteChartSetting.called).to.be.false;
            expect(chartSettingStore.deleteChartSetting.calledWith(id)).to.be.false;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith("/?deleteAction&failed")).to.be.true;
        });
        it("should redirect with query parameters when mongodb id has wrong format", async () => {
            const id = new ObjectId();
            req.body = {
                id: `chart-asdfasdf`,
            };

            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            app.chartSettingStore = chartSettingStore;
            chartSettingStore.deleteChartSetting.resolves(false);

            await controller.deleteCharSetting(req, res);

            expect(chartSettingStore.deleteChartSetting.called).to.be.false;
            expect(chartSettingStore.deleteChartSetting.calledWith(id)).to.be.false;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith("/?deleteAction&failed")).to.be.true;
        });
        it("should redirect with query parameters when db deletion was not successful", async () => {
            const id = new ObjectId();
            req.body = {
                id: `chart-${id.toString()}`,
            };

            const chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            app.chartSettingStore = chartSettingStore;
            chartSettingStore.deleteChartSetting.resolves(false);

            await controller.deleteCharSetting(req, res);

            expect(chartSettingStore.deleteChartSetting.called).to.be.true;
            expect(chartSettingStore.deleteChartSetting.calledWith(id)).to.be.true;
            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith("/?deleteAction&failed")).to.be.true;
        });
        it("should redirect with query parameters when not successful", async () => {
            app.chartSettingStore = sinon.createStubInstance(ChartSettingStoreImpl);
            req.body = {};

            await controller.deleteCharSetting(req, res);

            expect(res.redirect.called).to.be.true;
            expect(res.redirect.calledWith("/?deleteAction&failed")).to.be.true;
        });
    });
});
