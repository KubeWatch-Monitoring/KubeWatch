import {MetricsData} from "./metrics-data";

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
}
