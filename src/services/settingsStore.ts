import {MongoDbController} from "./mongoDbController";
import {Collection} from "mongodb";
import {Setting} from "../model/setting";

export class SettingsStore {
    private settingsCollection: Collection;

    constructor(dbController: MongoDbController) {
        this.settingsCollection = dbController.db.collection("settings");
    }

    async getSettings() {
        return await this.settingsCollection.find().toArray() as unknown as Setting[];
    }

    async updateSetting(setting: Setting) {
        const query = {name: setting.name};
        return await this.settingsCollection.updateOne(query, {$set: setting});
    }

    async getByName(name: string, defaultValue: any): Promise<Setting> {
        const query = {name};
        const result = await this.settingsCollection.findOne(query);
        let value;
        if (result == null) {
            value = defaultValue;
        } else {
            value = result.value;
        }
        return new Setting(name, value);
    }
}
