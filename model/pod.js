"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pod = void 0;
class Pod {
    constructor(id, name, description, metrics) {
        this.id = 0;
        this.name = "";
        this.description = "";
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
exports.Pod = Pod;
//# sourceMappingURL=pod.js.map