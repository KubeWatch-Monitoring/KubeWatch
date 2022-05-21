import {expect} from "chai";
import sinon from "sinon";
import {Collection, Db, FindCursor} from "mongodb";
import {MongoDbService} from "../../../services/mongo-db-service";
import {SettingStoreImpl} from "../../../services/setting-store-impl";
import {Setting, SettingType} from "../../../model/setting";

describe("SettingsStoreImpl", () => {
    let store: SettingStoreImpl;
    let dbService: any
    let collection: any;

    beforeEach(() => {
        const db = sinon.createStubInstance(Db);
        dbService = sinon.createStubInstance(MongoDbService);
        dbService.db = db;
        collection = sinon.createStubInstance(Collection);
        dbService.db.collection.returns(collection);
        store = new SettingStoreImpl(dbService);
    });

    describe("getSettings", () => {
        it("should return an array of settings", async () => {
            const expectedSettings = [
                new Setting("myString", "blubBlub", SettingType.String),
                new Setting("myNumber", 2, SettingType.Number),
                new Setting("myBoolean", false, SettingType.Boolean),
            ];
            const cursor = sinon.createStubInstance(FindCursor);
            cursor.toArray.resolves(expectedSettings);
            collection.find.returns(cursor);

            const settings = await store.getSettings();

            expect(collection.find.called).to.be.true;
            expect(collection.find.calledWith()).to.be.true;
            expect(settings).to.be.eql(expectedSettings);
        });
        it("should return an empty array of notification when no notifications stored", async () => {
            const expectedSettings: Setting[] = [];
            const cursor = sinon.createStubInstance(FindCursor);
            cursor.toArray.resolves(expectedSettings);
            collection.find.returns(cursor);

            const settings = await store.getSettings();

            expect(collection.find.called).to.be.true;
            expect(collection.find.calledWith()).to.be.true;
            expect(settings).to.be.eql(expectedSettings);
        });
    });
    describe("updateSetting", () => {
        it("should update the given setting in the database", async () => {
            const setting = new Setting("mySetting", "new", SettingType.String);

            await store.updateSetting(setting);

            expect(collection.updateOne.called).to.be.true;
            expect(collection.updateOne.calledWith({name: setting.name}, {$set: setting})).to.be.true;
        });
    });
    describe("getByName", () => {
        it("should return the asked setting", async () => {
            const expectedSetting = new Setting("mySetting", "new", SettingType.String);
            collection.findOne.resolves(expectedSetting);

            const setting = await store.getByName(expectedSetting.name, "default");

            expect(setting).to.be.eql(expectedSetting);
        });
        it("should return the asked setting with default value when not found", async () => {
            const expectedSetting = new Setting("mySetting", "default", SettingType.String);
            collection.findOne.resolves(null);

            const setting = await store.getByName(expectedSetting.name, "default");

            expect(setting).to.be.eql(expectedSetting);
        });
    });
});
