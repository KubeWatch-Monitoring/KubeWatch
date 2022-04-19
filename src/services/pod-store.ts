import {Pod} from "../model/pod";
import {MetricsData} from "../model/metrics-data";
import {PrometheusService} from "./prometheus-service";

export class PodStore {
    constructor(public prometheusService: PrometheusService) {
    }

    private static getRandomPods() {
        return [
            new Pod(
                "1",
                "My Database Pod",
                new MetricsData(
                    Math.floor(Math.random() * 101),
                    Math.floor(Math.random() * 101),
                    Math.floor(Math.random() * 101)
                )
            ),
            new Pod(
                "2",
                "My Webserver Pod",
                new MetricsData(
                    Math.floor(Math.random() * 101),
                    Math.floor(Math.random() * 101),
                    Math.floor(Math.random() * 101)
                )
            ),
            new Pod(
                "3",
                "My Redis Pod",
                new MetricsData(
                    Math.floor(Math.random() * 101),
                    Math.floor(Math.random() * 101),
                    Math.floor(Math.random() * 101)
                )
            ),
        ];
    }

    async getAllPods() {
        return PodStore.getRandomPods();
    }

    async getPodById(id: number) {
        const allPods = PodStore.getRandomPods();

        if (id < 0 || id > allPods.length) {
            throw new Error(`Pod with ID ${id} does not exist`);
        }
        return allPods[id];
    }

    async testInstantQuery() {
        return this.prometheusService.retrieveInstantQuery()
    }

    async testRangeQuery() {
        return this.prometheusService.retrieveRangeQuery();
    }

    async testSeriesQuery() {
        return this.prometheusService.retrieveSeriesQuery()
    }
}
