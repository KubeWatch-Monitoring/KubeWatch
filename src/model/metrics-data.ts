export class MetricsData {
    constructor(
        public cpu: number,
        public memory: number,
        public disk: number
    ) {
        this.cpu = cpu;
        this.memory = memory;
        this.disk = disk;
    }
}
