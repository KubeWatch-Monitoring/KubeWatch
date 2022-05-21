import {PodStore} from "../model/pod";
import {PrometheusService} from "./prometheus-service";

export class PodStoreImpl implements PodStore {
    constructor(public prometheusService: PrometheusService) {
    }

    async getAllPods() {
        return this.prometheusService.getAllPods()
    }

    async getPodById(id: string) {
        return this.prometheusService.getPodById(id);
    }
}
