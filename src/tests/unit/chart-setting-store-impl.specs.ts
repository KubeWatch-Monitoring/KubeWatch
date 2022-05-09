import {expect} from "chai";
import sinon from "sinon";
import {Collection, Db, FindCursor, ObjectId} from "mongodb";
import {ChartSettingStoreImpl} from "../../services/chart-setting-store-impl";
import {MongoDbService} from "../../services/mongo-db-service";
import {ChartSetting} from "../../model/chart-setting";

describe("ChartSettingStoreImpl", () => {
    let store: ChartSettingStoreImpl;
    let dbService: any
    let collection: any;

    beforeEach(() => {
        const db = sinon.createStubInstance(Db);
        dbService = sinon.createStubInstance(MongoDbService);
        dbService.db = db;
        collection = sinon.createStubInstance(Collection);
        dbService.db.collection.returns(collection);
        store = new ChartSettingStoreImpl(dbService);
    });

    describe("createChartSetting", () => {
        it("it should create a new ChartSetting with an ID", async () => {
            const expectedChartSetting = new ChartSetting("blub", "some prom ql", -1800, 0, 1000, new ObjectId());
            const chartSetting = new ChartSetting("blub", "some prom ql", -1800, 0, 1000, new ObjectId());
            collection.insertOne.resolves(expectedChartSetting);

            const newChartSetting = await store.createChartSetting(chartSetting);

            expect(collection.insertOne.called).to.be.true;
            expect(collection.insertOne.calledWith(chartSetting)).to.be.true;
            expect(newChartSetting).to.be.eql(expectedChartSetting);
        });
    });
    describe("deleteChartSetting", () => {
        it("should return true if chart setting was deleted successfully", async () => {
            const id = new ObjectId();
            collection.deleteOne.resolves({deletedCount: 1});

            const result = await store.deleteChartSetting(id);

            expect(result).to.be.true;
            expect(collection.deleteOne.called).to.be.true;
            expect(collection.deleteOne.calledWith({_id: id})).to.be.true;
        });
    });
    describe("getAllChartSettings", () => {
        it("should return an array of chart settings", async () => {
            const expectedChartSettings = [
                new ChartSetting("blub", "some prom ql", -1800, 0, 1000, new ObjectId()),
                new ChartSetting("my chart", "some prom ql", -1800, 0, 1000, new ObjectId()),
                new ChartSetting("some chart", "some prom ql", -1800, 0, 1000, new ObjectId()),
                new ChartSetting("other chart", "some prom ql", -1800, 0, 1000, new ObjectId()),
            ];
            const cursor = sinon.createStubInstance(FindCursor);
            cursor.toArray.resolves(expectedChartSettings);
            collection.find.returns(cursor);

            const chartSettings = await store.getAllChartSettings();

            expect(collection.find.called).to.be.true;
            expect(collection.find.calledWith()).to.be.true;
            expect(chartSettings).to.be.eql(expectedChartSettings);
        });
        it("should return an empty array of chart settings when no chart setting is stored", async () => {
            const expectedChartSettings: ChartSetting[] = []
            const cursor = sinon.createStubInstance(FindCursor);
            cursor.toArray.resolves(expectedChartSettings);
            collection.find.returns(cursor);

            const chartSettings = await store.getAllChartSettings();

            expect(collection.find.called).to.be.true;
            expect(collection.find.calledWith()).to.be.true;
            expect(chartSettings).to.be.eql(expectedChartSettings);
        });
    });
});
