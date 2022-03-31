"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promController = exports.PrometheusController = void 0;
const prometheus_query_1 = require("prometheus-query");
const prom = new prometheus_query_1.PrometheusDriver({
    // endpoint: 'http://127.0.0.1:9090',
    // endpoint: 'http://prometheus:9090',
    // endpoint: "https://prometheus.demo.do.prometheus.io",
    endpoint: "http://prometheus.monitoring:9090",
    baseURL: "/api/v1",
});
async function retrieveInstantQuery() {
    const instantQuery = 'up{instance="demo.do.prometheus.io:9090",job="node"}';
    // const instantQuery = 'prometheus_target_interval_length_seconds_sum{interval="15s"}';
    const instantQueryResponse = await prom.instantQuery(instantQuery);
    return instantQueryResponse.result;
}
async function retrieveRangeQuery() {
    const q = 'up';
    const start = new Date().getTime() - 24 * 60 * 60 * 1000;
    const end = new Date();
    const step = 6 * 60 * 60; // 1 point every 6 hours
    const rangeQuery = await prom.rangeQuery(q, start, end, step);
    return rangeQuery.result;
}
class PrometheusController {
    async getMetrics(req, res) {
        console.log("getMetrics start");
        // const test = await axios.get('http://prometheus.monitoring:9090');
        // console.log(test);
        res.render("promView", {
            style: req.session.style,
            display: req.session.display,
            promMetrics: await retrieveRangeQuery(),
            // promMetrics: await retrieveInstantQuery(),
        });
        console.log('getMetrics stop');
    }
}
exports.PrometheusController = PrometheusController;
exports.promController = new PrometheusController();
//# sourceMappingURL=prom-controller.js.map