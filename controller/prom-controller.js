"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promController = exports.PrometheusController = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
class PrometheusController {
    async getMetrics(req, res) {
        res.setHeader("Content-Type", register.contentType);
        res.send(await register.metrics());
        // res.send(await fetch("http://localhost:9100/metrics")); // does not yet work..
        // res.render("promView", {
        //   style: req.session.style,
        //   display: req.session.display,
        //   promMetrics: await register.metrics(),
        // });
    }
}
exports.PrometheusController = PrometheusController;
exports.promController = new PrometheusController();
const register = new prom_client_1.default.Registry();
register.setDefaultLabels({
    app: "monitoring-kubewatch",
});
prom_client_1.default.collectDefaultMetrics({ register });
//# sourceMappingURL=prom-controller.js.map