import { MetricsData } from "./metrics-data";

export enum Health {
  Running = "Running",
  Pending = "Pending",
  Down = "Down"
}

export class Pod {
  id = "";
  name = "";
  health = Health.Running;
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
