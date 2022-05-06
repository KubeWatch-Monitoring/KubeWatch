import {MongoDbService} from "./mongo-db-service";
import {Collection} from "mongodb";
import {Setting, SettingStore, SettingType, settingTypeFromString} from "../model/setting";

export class SettingStoreImpl implements SettingStore {
    private settingsCollection: Collection;

    constructor(mongoDbService: MongoDbService) {
        this.settingsCollection = mongoDbService.db.collection("settings");
    }

    async getSettings() {
        return this.settingsCollection.find().toArray() as unknown as Setting[];
    }

    async updateSetting(setting: Setting) {
        const query = {name: setting.name};
        await this.settingsCollection.updateOne(query, {$set: setting});
    }

    async getByName(name: string, defaultValue: string | number | boolean) {
        const query = {name};
        const result = await this.settingsCollection.findOne(query);
        let value;
        let type: SettingType;
        if (result == null) {
            value = defaultValue;
            type = settingTypeFromString(typeof defaultValue);
        } else {
            value = result.value;
            type = settingTypeFromString(result.type);
        }
        return new Setting(name, value, type);
    }
}
