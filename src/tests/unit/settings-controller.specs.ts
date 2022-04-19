import chai, { expect } from "chai";
import sinon from "sinon";
import { app } from "../../app";
import {SettingsController} from "../../controller/settings-controller";
import {SettingsStore} from "../../services/settingsStore";
import {NotificationStore} from "../../services/notificationStore";
import {Setting} from "../../model/setting";
import {Request, Response} from "express";
import {Helpers} from "../test-helper";


describe("SettingsController", () => {
    let controller: SettingsController;
    let settingsStore: any;
    let notificationStore: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        controller = new SettingsController();
        settingsStore = sinon.createStubInstance(SettingsStore);
        notificationStore = sinon.createStubInstance(NotificationStore);

        req = {app};
        res = Helpers.getMockResponse();

        app.settingsStore = settingsStore;
        app.notificationStore = notificationStore;
    })

    describe("getSettings", () => {
        const URL = "/";
        it("should return a rendered html page", async () => {
            req.originalUrl = URL;
            settingsStore.getSettings.resolves([new Setting("name", "value")]);
            notificationStore.getAllNotifications.resolves([]);
            notificationStore.getNotSilencedNotifications.resolves([]);

            await controller.getSettings(req, res);
            expect(settingsStore.getSettings.called).to.be.true;
            expect(notificationStore.getNotSilencedNotifications.called).to.be.true;
            expect(notificationStore.getAllNotifications.called).to.be.true;
            expect(res.render.called).to.be.true;
            expect(res.render.calledWithMatch("settings", {
                settings: [new Setting("name", "value")],
                pendingNotifications: [],
                notifications: [],
                currentUrl: req.originalUrl,
            })).to.be.true;
        });
    });

    describe("updateSetting", () => {
        const URL = "/";
        it("should return a rendered html page", async () => {
            req.originalUrl = URL;
            req.body = {
                setting: {
                    name: "value",
                    other: "otherValue"
                }
            };

            await controller.updateSetting(req, res);
            expect(settingsStore.updateSetting.calledTwice).to.be.true;
            expect(settingsStore.updateSetting.calledWith(new Setting("name", "value"))).to.be.true;
            expect(settingsStore.updateSetting.calledWith(new Setting("other", "otherValue"))).to.be.true;
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
