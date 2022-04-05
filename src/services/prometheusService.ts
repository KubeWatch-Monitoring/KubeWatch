import { PrometheusDriver } from 'prometheus-query';
import {Pod} from "../model/pod";
import {MetricsData} from "../model/metrics-data";

export class PrometheusService {
    readonly driver: PrometheusDriver;

    constructor(driver: PrometheusDriver) {
        this.driver = driver;
    }

    async getAllPods() {
        const getPodIdentificationsQuery = 'sum by (uid, pod) (kube_pod_info{namespace!~"kube-system|monitoring|kubernetes-dashboard"})';
        const getPodIdentificationsResponse = await this.driver.instantQuery(getPodIdentificationsQuery);

        let filterQuery = '';
        const result = getPodIdentificationsResponse.result.map(vector => {
            const pod = new Pod(vector.metric.labels.uid, vector.metric.labels.pod, new MetricsData(0, 0, 0));
            filterQuery += `${pod.name}|`;
        });

        const query = 'sum by (pod, image) ({__name__=~"kube_pod_info|kube_pod_container_info", namespace!~"kube-system|monitoring|kubernetes-dashboard"})';
        const blub = await this.driver.instantQuery(query);
        blub.result.forEach(v => console.log(v.metric));

        return result;
    }

    async getAllDeployments() {
        const instantQuery = 'kube_deployment_created';
        const instantQueryResponse = await this.driver.instantQuery(instantQuery);
        return instantQueryResponse.result.flat();
    }
}

if (process.env.PROMETHEUS_CONN_STRING === undefined) {
    throw new Error("Environment variable PROMETHEUS_CONN_STRING is missing");
}

export const prometheusService = new PrometheusService(new PrometheusDriver({
    endpoint: process.env.PROMETHEUS_CONN_STRING,
    baseURL: "/api/v1",
}));
