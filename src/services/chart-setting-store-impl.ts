import {ChartSetting, ChartSettingStore} from "../model/chart-setting";
import {Collection, ObjectId} from "mongodb";
import {MongoDbService} from "./mongo-db-service";

export class ChartSettingStoreImpl implements ChartSettingStore {
    private chartSettingCollection: Collection;

    constructor(private mongoDbService: MongoDbService) {
        this.chartSettingCollection = mongoDbService.db.collection("chartSettings");
    }

    async createChartSetting(chart: ChartSetting): Promise<ChartSetting> {
        return await this.chartSettingCollection.insertOne(chart) as unknown as ChartSetting;
    }

    async deleteChartSetting(id: ObjectId): Promise<boolean> {
        const query = {_id: id};
        const result = await this.chartSettingCollection.deleteOne(query);
        return result.deletedCount == 1;
    }

    async getAllChartSettings() {
        return this.chartSettingCollection.find().toArray() as unknown as ChartSetting[];
    }

    async reconnect() {
        await this.mongoDbService.reconnect();
    }
}
