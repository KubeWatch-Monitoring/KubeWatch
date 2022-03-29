export class MetricsData {
  cpu: number = 0;
  memory: number = 0;
  disk: number = 0;

  constructor(cpu: number, memory: number, disk: number) {
    this.cpu = cpu;
    this.memory = memory;
    this.disk = disk;
  }

  toObject() {
    return {
      cpu: this.cpu,
      memory: this.memory,
      disk: this.disk,
    };
  }
}
