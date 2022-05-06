import { ObjectId } from "mongodb";

export enum ChartType {
    relative
}

export class ChartSetting {
    constructor(public title: string,
                public promql: string,
                public start: number,
                public end: number,
                public updateInterval: number,
                public _id: ObjectId | undefined){}
}

export interface ChartSettingStore {
    createChartSetting(chart: ChartSetting): Promise<ChartSetting>;
    getAllChartSettings(): Promise<ChartSetting[]>
}
