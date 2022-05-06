import {ChartSetting, ChartSettingStore} from "../model/chart-setting";
import {Collection} from "mongodb";
import {MongoDbService} from "./mongo-db-service";

export class ChartSettingStoreImpl implements ChartSettingStore {
    private chartSettingCollection: Collection;

    constructor(mongoDbService: MongoDbService) {
        this.chartSettingCollection = mongoDbService.db.collection("chartSettings");
    }

    async createChartSetting(chart: ChartSetting): Promise<ChartSetting> {
        return await this.chartSettingCollection.insertOne(chart) as unknown as ChartSetting;
    }

    async getAllChartSettings() {
        return this.chartSettingCollection.find().toArray() as unknown as ChartSetting[];
    }
}
