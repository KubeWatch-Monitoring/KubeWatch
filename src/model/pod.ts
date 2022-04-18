import { MetricsData } from "./metrics-data";

export enum Health {
  Running = "Running",
  Pending = "Pending",
  Failed = "Failed",
  Succeeded = "Succeeded",
  Unknown = "Unknown",
}

export class Pod {
  id: number = 0;
  name: string = "";
  description: string = "";
  health = Health.Unknown;
  metrics: MetricsData;

  constructor(
    id: number,
    name: string,
    description: string,
    metrics: MetricsData
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.metrics = metrics;
  }

  toObject() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      metrics: this.metrics.toObject(),
    };
  }
}
