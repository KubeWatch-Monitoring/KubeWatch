import {expect} from "chai";
import sinon from "sinon";
import {Collection, Db} from "mongodb";
import {MongoDbService} from "../../services/mongo-db-service";
import {DatabaseFillManager} from "../../services/database-fill-manager";
import {DatabasePrefill} from "../../model/database-prefill";
import {ChartSetting} from "../../model/chart-setting";
import {Setting, SettingType} from "../../model/setting";

describe("DatabaseFillManager", () => {
    let manager: DatabaseFillManager;
    let dbService: any
    let flagsCollection: any;
    let db: any;

    beforeEach(() => {
        db = sinon.createStubInstance(Db);
        dbService = sinon.createStubInstance(MongoDbService);
        dbService.db = db;
        flagsCollection = sinon.createStubInstance(Collection);
        dbService.db.collection.withArgs("flags").returns(flagsCollection);
        manager = new DatabaseFillManager(dbService);
    });

    describe("isDatabaseFilledUp", () => {
        it("should return false when the flag is not set in the database", async () => {
            flagsCollection.findOne.resolves(null);

            const result = await manager.isDatabaseFilledUp();

            expect(result).to.be.false;
        });
        it("should return false when the flag is set to false", async () => {
            flagsCollection.findOne.resolves({name: "prefilled", value: false});
            const result = await manager.isDatabaseFilledUp();

            expect(result).to.be.false;
        });
        it("should return true when the flag is set to true", async () => {
            flagsCollection.findOne.resolves({name: "prefilled", value: true});
            const result = await manager.isDatabaseFilledUp();

            expect(result).to.be.true;
        });
    });
    describe("setDatabaseFillUp", () => {
        it("should update the flag with true in the database if the argument is true", async () => {
            await manager.setDatabaseFillUp(true);

            expect(flagsCollection.updateOne.calledWith(
                {name: "prefilled"},
                {$setOnInsert: {name: "prefilled", value: true}},
                {upsert: true})).to.be.true;
        });
        it("should update the flag with false in the database if the argument is false", async () => {
            await manager.setDatabaseFillUp(false);

            expect(flagsCollection.updateOne.calledWith(
                {name: "prefilled"},
                {$setOnInsert: {name: "prefilled", value: false}},
                {upsert: true})).to.be.true;
        });
    });
    describe("fillUpDatabase", () => {
        it("should fill up the database with the provided values", async () => {
            class Data implements DatabasePrefill {
                getChartSettings(): ChartSetting[] {
                    return [
                        new ChartSetting(
                            "asdf",
                            "promql query",
                            -180000,
                            0,
                            1000,
                            undefined
                            )
                    ];
                }
                getSettings(): Setting[] {
                    return [
                        new Setting(
                            "mySetting",
                            false,
                            SettingType.Boolean
                        )
                    ];
                }
            }

            const data = new Data();
            const chartSettingCollection = sinon.createStubInstance(Collection);
            dbService.db.collection.withArgs("chartSettings").returns(chartSettingCollection);
            const settingsCollection = sinon.createStubInstance(Collection);
            dbService.db.collection.withArgs("settings").returns(settingsCollection);
            const usersCollection = sinon.createStubInstance(Collection);
            dbService.db.collection.withArgs("users").returns(usersCollection);


            await manager.fillUpDatabase(data);

            expect(chartSettingCollection.insertMany.called).to.be.true;
            expect(chartSettingCollection.insertMany.calledWith(data.getChartSettings())).to.be.true;

            expect(settingsCollection.insertMany.called).to.be.true;
            expect(settingsCollection.insertMany.calledWith(data.getSettings())).to.be.true;
        });
    });
});
