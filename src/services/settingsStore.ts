import {MongoDbController} from "./mongoDbController";
import {Collection, ObjectId, UpdateResult} from "mongodb";

export class SettingsStore {
    private settingsCollection: Collection;

    constructor(dbController: MongoDbController) {
        this.settingsCollection = dbController.db.collection("settings");
    }

    async getBoolean(name: string, defaultValue = false) {
        const query = {name};
        const value = await this.settingsCollection.findOne(query);
        if (value == null) {
            return defaultValue;
        } else {
            return value;
        }
    }
}
