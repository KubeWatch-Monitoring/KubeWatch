import {MetricsData} from "./metrics-data";
import {Metric} from "prometheus-query";

export type Health = "Running" | "Pending" | "Failed" | "Succeeded" | "Unknown";

export class Pod {
    health: Health = "Unknown";
    image = ""

    constructor(
        public id: string,
        public name: string,
        public metrics: MetricsData,
    ) {
    }
}

export interface PodStore {
    getAllPods(): Promise<Pod[]>;

    getPodById(id: string): Promise<Pod>;

    testInstantQuery(): Promise<any[]>;

    testRangeQuery(): Promise<any[]>;

    testSeriesQuery(): Promise<Metric[]>
}
