import {PrometheusDriver} from 'prometheus-query';
import {Health, Pod} from "../model/pod";
import {MetricsData} from "../model/metrics-data";

export class PrometheusService {
    private constructor(public driver: PrometheusDriver) {
    }

    static connect(url: string) {
        const prometheusDriver = new PrometheusDriver({
            endpoint: url,
            baseURL: "/api/v1",
        });
        return new PrometheusService(prometheusDriver);
    }

    async retrieveInstantQuery() {
        const instantQuery = 'kube_pod_container_info{container!=""}';
        const instantQueryResponse = await this.driver.instantQuery(instantQuery);
        return instantQueryResponse.result.flat();
    }

    async getAllPods() {
        const excludeNamespaces = "kube-system|monitoring|kubernetes-dashboard";
        const getPodIdentificationsQuery = `sum by (uid, pod) (kube_pod_info{namespace!~"${excludeNamespaces}"})`;
        const getPodIdentificationsResponse = await this.driver.instantQuery(getPodIdentificationsQuery);

        const allPods = getPodIdentificationsResponse.result.map(vector => {
            return new Pod(vector.metric.labels.uid, vector.metric.labels.pod, new MetricsData(0, 0, 0));
        });

        for (const pod of allPods) {
            const podImageQuery = `sum by (pod, image) ({__name__=~"kube_pod_container_info", pod=~"${pod.name}"})`;
            const podImageResult = await this.driver.instantQuery(podImageQuery);
            const podImageValue = podImageResult.result.map((res) => {
                return res.metric.labels.image;
            })
            pod.image = podImageValue.toString();

            const podCPUQuery = `sum by (pod) (container_cpu_system_seconds_total{pod=~"${pod.name}"})`;
            const podCPUResult = await this.driver.instantQuery(podCPUQuery);
            const podCPUValue = podCPUResult.result.map((res) => {
                return res.value.value;
            });
            pod.metrics.cpu = +podCPUValue;

            const podMemoryQuery = `sum by (pod) (container_memory_usage_bytes{pod=~"${pod.name}"})`;
            const podMemoryResult = await this.driver.instantQuery(podMemoryQuery);
            const podMemoryValue = podMemoryResult.result.map((res) => {
                return res.value.value;
            });
            pod.metrics.memory = (+podMemoryValue) / (2 ** 20);  // convert to megabytes (MiB)

            const podDiskQuery = `sum by (pod) (container_fs_usage_bytes{pod=~"${pod.name}"})`;
            const podDiskResult = await this.driver.instantQuery(podDiskQuery);
            const podDiskValue = podDiskResult.result.map((res) => {
                return res.value.value;
            });
            pod.metrics.disk = (+podDiskValue) / (2 ** 10);  // convert to kilobytes (KiB)

            const podHealthQuery = `sum by (phase) (kube_pod_status_phase{pod=~"${pod.name}"})`;
            const podHealthResult = await this.driver.instantQuery(podHealthQuery);
            let podHealthValue: Health = "Unknown";
            podHealthResult.result.forEach((res) => {
                if (parseInt(res.value.value) === 1) {
                    podHealthValue = res.metric.labels.phase as Health;
                }
            });
            pod.health = podHealthValue;
        }
        return allPods;
    }

    async getPodById(id: string) {
        const allPods = await this.getAllPods();
        const pod = allPods.find(pod => pod.id === id);
        if (pod == undefined)
            throw new Error(`Pod with ID ${id} does not exist`);
        return pod;
    }
}
