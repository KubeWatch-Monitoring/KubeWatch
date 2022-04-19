import { MetricsData } from "./metrics-data";

export type Health = "Running" | "Pending" | "Failed" | "Succeeded" | "Unknown";

export class Pod {
  id = "";
  name = "";
  health = "Unknown";
  image = ""
  metrics: MetricsData;

  constructor(
      id: string,
      name: string,
      metrics: MetricsData
  ) {
    this.id = id;
    this.name = name;
    this.metrics = metrics;
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      health: this.health,
      metrics: this.metrics.toObject(),
    };
  }
}
