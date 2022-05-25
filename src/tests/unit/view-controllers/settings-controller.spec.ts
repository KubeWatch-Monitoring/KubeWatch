import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../../app";
import {SettingsController} from "../../../view-controllers/settings-controller";
import {SettingStoreImpl} from "../../../stores/setting-store-impl";
import {NotificationStoreImpl} from "../../../stores/notification-store-impl";
import {Setting, SettingType} from "../../../model/setting";
import {TestHelper} from "../../test-helper";
import {ControllerUtil} from "../../../utils/controller-util";


describe("SettingsController", () => {
    let controller: SettingsController;
    let settingsStore: any;
    let notificationStore: any;
    let controllerUtil: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        controllerUtil = sinon.createStubInstance(ControllerUtil);
        settingsStore = sinon.createStubInstance(SettingStoreImpl);
        notificationStore = sinon.createStubInstance(NotificationStoreImpl);
        controller = new SettingsController(controllerUtil);

        res = TestHelper.getMockResponse();
        req = TestHelper.getMockRequest(app);
    })

    describe("getSettings", () => {
        const URL = "/";
        it("should return a rendered html page", async () => {
            app.settingsStore = settingsStore;
            app.notificationStore = notificationStore;
            settingsStore.getSettings.resolves([new Setting("name", "value", SettingType.String)]);
            notificationStore.getRecentNotifications.resolves([]);
            notificationStore.getNotSilencedNotifications.resolves([]);

            await controller.getSettings(req, res);
            expect(settingsStore.getSettings.called).to.be.true;
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWith("settings", {
                settings: [new Setting("name", "value", SettingType.String)],
            })).to.be.true;
        });

        it("should return a rendered html page but database availability set to true", async () => {
            app.settingsStore = settingsStore;
            app.notificationStore = notificationStore;
            req.originalUrl = URL;
            settingsStore.getSettings.rejects();

            await controller.getSettings(req, res);
            expect(settingsStore.getSettings.called).to.be.true;
            expect(controllerUtil.setDatabaseAvailability.calledWith(false)).to.be.true;
            expect(controllerUtil.render.called).to.be.true;
            expect(controllerUtil.render.calledWith("settings", {
                settings: [],
            })).to.be.true;
        });
    });

    describe("updateSetting", () => {
        const URL = "/";
        it("should return a rendered html page", async () => {
            const s1 = new Setting("name", "value", SettingType.String);
            const s2 = new Setting("other", "otherValue", SettingType.String)
            const s3 = new Setting("someBool", "true", SettingType.Boolean);

            settingsStore.getByName.withArgs(s1.name).resolves(s1);
            settingsStore.getByName.withArgs(s2.name).resolves(s2);
            settingsStore.getByName.withArgs(s3.name).resolves(s3);
            req.body = {
                setting: {
                    name: "value",
                    other: "otherValue",
                    someBool: "true",
                }
            };
            app.settingsStore = settingsStore;

            await controller.updateSetting(req, res);
            expect(settingsStore.updateSetting.calledThrice).to.be.true;
            expect(settingsStore.updateSetting.calledWith(new Setting("name", "value", SettingType.String))).to.be.true;
            expect(settingsStore.updateSetting.calledWith(new Setting("other", "otherValue", SettingType.String))).to.be.true;
            expect(settingsStore.updateSetting.calledWith(new Setting("someBool", true, SettingType.Boolean))).to.be.true;
            expect(res.redirect.called).to.be.true;
        });

        it("should return a 400 if setting is missing", async () => {
            req.originalUrl = URL;
            req.body = {};

            await controller.updateSetting(req, res);
            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });

        it("should return a 400 if setting is only partial available", async () => {
            req.originalUrl = URL;
            req.body = {
                setting: [
                    2
                ]
            };

            await controller.updateSetting(req, res);
            expect(res.status.called).to.be.true;
            expect(res.status.calledWith(400)).to.be.true;
        });
    });
});
