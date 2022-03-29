"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.podStore = exports.PodStore = void 0;
const pod_1 = require("../model/pod");
const metrics_data_1 = require("../model/metrics-data");
class PodStore {
    getRandomPods() {
        return [
            new pod_1.Pod(1, "My Database Pod", "Some Description", new metrics_data_1.MetricsData(Math.floor(Math.random() * 101), Math.floor(Math.random() * 101), Math.floor(Math.random() * 101))),
            new pod_1.Pod(2, "My Webserver Pod", "Some Description", new metrics_data_1.MetricsData(Math.floor(Math.random() * 101), Math.floor(Math.random() * 101), Math.floor(Math.random() * 101))),
            new pod_1.Pod(3, "My Redis Pod", "Some Description", new metrics_data_1.MetricsData(Math.floor(Math.random() * 101), Math.floor(Math.random() * 101), Math.floor(Math.random() * 101))),
        ];
    }
    async getAllPods() {
        return this.getRandomPods();
    }
    async getPodById(id) {
        const allPods = this.getRandomPods();
        if (id < 0 || id > allPods.length) {
            throw new Error(`Pod with ID ${id} does not exist`);
        }
        return allPods[id];
    }
}
exports.PodStore = PodStore;
exports.podStore = new PodStore();
//# sourceMappingURL=podStore.js.map