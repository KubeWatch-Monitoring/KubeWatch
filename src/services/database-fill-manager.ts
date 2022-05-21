import {MongoDbService} from "./mongo-db-service";
import {Collection} from "mongodb";
import {DatabasePrefill} from "../model/database-prefill";

enum DatabaseFlags {
    PREFILLED = "prefilled"
}

export class DatabaseFillManager {

    private dbService: MongoDbService;
    private collection: Collection;

    constructor(mongoDbService: MongoDbService) {
        this.dbService = mongoDbService;
        this.collection = mongoDbService.db.collection("flags");
    }

    async isDatabaseFilledUp() {
        const result = await this.collection.findOne({name: DatabaseFlags.PREFILLED})
        return !(result === null || result.value == false)
    }

    async setDatabaseFillUp(filledUp: boolean) {
        const query = {name: DatabaseFlags.PREFILLED};
        await this.collection.updateOne(
            query,
            {$setOnInsert: {name:DatabaseFlags.PREFILLED, value: filledUp}},
            {upsert: true});
    }

    async fillUpDatabase(data: DatabasePrefill) {
        await this.dbService.db.collection("chartSettings").insertMany(data.getChartSettings());
        await this.dbService.db.collection("settings").insertMany(data.getSettings());
    }
}

