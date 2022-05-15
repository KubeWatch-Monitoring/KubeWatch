import { ObjectId } from "mongodb";
import {Reconnectable} from "../services/reconnectable";

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

export interface ChartSettingStore extends Reconnectable {
    createChartSetting(chart: ChartSetting): Promise<ChartSetting>;
    deleteChartSetting(id: ObjectId): Promise<boolean>;
    getAllChartSettings(): Promise<ChartSetting[]>
}
