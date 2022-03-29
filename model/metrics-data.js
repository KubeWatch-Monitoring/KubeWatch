"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricsData = void 0;
class MetricsData {
    constructor(cpu, memory, disk) {
        this.cpu = 0;
        this.memory = 0;
        this.disk = 0;
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
exports.MetricsData = MetricsData;
//# sourceMappingURL=metrics-data.js.map