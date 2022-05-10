import {expect} from "chai";
import sinon from "sinon";
import {Collection, Db, FindCursor, ObjectId} from "mongodb";
import {NotificationStoreImpl} from "../../services/notification-store-impl";
import {MongoDbService} from "../../services/mongo-db-service";
import {Notification} from "../../model/notification";

describe("NotificationStoreImpl", () => {
    let store: NotificationStoreImpl;
    let dbService: any
    let collection: any;

    beforeEach(() => {
        const db = sinon.createStubInstance(Db);
        dbService = sinon.createStubInstance(MongoDbService);
        dbService.db = db;
        collection = sinon.createStubInstance(Collection);
        dbService.db.collection.returns(collection);
        store = new NotificationStoreImpl(dbService);
    });

    describe("getById", () => {
        it("should return an Notification when found", async () => {
            const expectedNotification = new Notification("blub", new Date());
            collection.findOne.resolves(expectedNotification);

            const notification = await store.getById(new ObjectId());

            expect(notification).to.be.eql(expectedNotification);
        });

        it("should return undefined when not found", async () => {
            collection.findOne.resolves(null);

            const notification = await store.getById(new ObjectId());

            expect(notification).to.be.eql(null);
        });
    });
    describe("updateNotification", () => {
        it("should update the notification", async () => {
            const notification = new Notification("blub", new Date());
            notification._id = new ObjectId();

            await store.updateNotification(notification);

            expect(collection.updateOne.called).to.be.true;
            expect(collection.updateOne.calledWithMatch({_id: notification._id}, {$set: notification})).to.be.true;
        });
    });
    describe("getAllNotifications", () => {
        it("should return an array of notification", async () => {
            const expectedNotifications = [
                new Notification("blub", new Date()),
                new Notification("blub", new Date()),
                new Notification("blub", new Date()),
            ]
            const cursor = sinon.createStubInstance(FindCursor);
            cursor.toArray.resolves(expectedNotifications);
            collection.find.returns(cursor);

            const notifications = await store.getAllNotifications();

            expect(collection.find.called).to.be.true;
            expect(collection.find.calledWith()).to.be.true;
            expect(notifications).to.be.eql(expectedNotifications);
        });
        it("should return an empty array of notification when no notifications stored", async () => {
            const expectedNotifications: Notification[] = []
            const cursor = sinon.createStubInstance(FindCursor);
            cursor.toArray.resolves(expectedNotifications);
            collection.find.returns(cursor);

            const notifications = await store.getAllNotifications();

            expect(collection.find.called).to.be.true;
            expect(collection.find.calledWith()).to.be.true;
            expect(notifications).to.be.eql(expectedNotifications);
        });
    });
    describe("getNotSilencedNotifications", () => {
        it("should return an array of notification", async () => {
            const expectedNotifications = [
                new Notification("blub", new Date()),
                new Notification("blub", new Date()),
                new Notification("blub", new Date()),
            ]
            const cursor = sinon.createStubInstance(FindCursor);
            cursor.toArray.resolves(expectedNotifications);
            collection.find.returns(cursor);

            const notifications = await store.getNotSilencedNotifications();

            expect(collection.find.called).to.be.true;
            expect(collection.find.calledWith({isSilenced: false})).to.be.true;
            expect(notifications).to.be.eql(expectedNotifications);
        });
        it("should return an empty array of notification when no notifications stored", async () => {
            const expectedNotifications: Notification[] = []
            const cursor = sinon.createStubInstance(FindCursor);
            cursor.toArray.resolves(expectedNotifications);
            collection.find.returns(cursor);

            const notifications = await store.getNotSilencedNotifications();

            expect(collection.find.called).to.be.true;
            expect(collection.find.calledWith({isSilenced: false})).to.be.true;
            expect(notifications).to.be.eql(expectedNotifications);
        });
    });
    describe("createNotification", () => {
        it("should insert new notification into database", async () => {
            const expectedNotification = new Notification("blub", new Date());
            const notification = new Notification("blub", new Date());
            expectedNotification._id = new ObjectId();

            collection.insertOne.resolves(expectedNotification);

            const newNotification = await store.createNotification(notification);

            expect(collection.insertOne.called).to.be.true;
            expect(collection.insertOne.calledWith(notification)).to.be.true;
            expect(newNotification).to.be.eql(expectedNotification);
        });
    });
    describe("onNotification", () => {
        it("should insert new notification into database when onNotification is called", async () => {
            const expectedNotification = new Notification("blub", new Date());
            const notification = new Notification("blub", new Date());
            expectedNotification._id = new ObjectId();

            collection.insertOne.resolves(expectedNotification);

            await store.onNotification(notification);

            expect(collection.insertOne.called).to.be.true;
            expect(collection.insertOne.calledWith(notification)).to.be.true;
        });
    });
});
