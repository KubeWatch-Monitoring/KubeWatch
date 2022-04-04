import { MetricsData } from "./metrics-data";

export class Pod {
  id: number = 0;
  name: string = "";
  description: string = "";
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
