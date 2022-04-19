import {MetricsData} from "./metrics-data";

export type Health = "Running" | "Pending" | "Failed" | "Succeeded" | "Unknown";

export class Pod {
    health = "Unknown";
    image = ""

    constructor(
        public id: string,
        public name: string,
        public metrics: MetricsData
    ) {
        this.id = id;
        this.name = name;
        this.metrics = metrics;
    }
}
