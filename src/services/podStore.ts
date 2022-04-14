import { Pod } from "../model/pod";
import { MetricsData } from "../model/metrics-data";
import {prometheusService} from "./prometheusService";

export class PodStore {
  private podInfo: Pod | undefined;

  async getAllPods() {
    return await prometheusService.getAllPods();
  }

  async getPodById(id: string) {
    const allPods = await this.getAllPods();
    allPods.forEach((pod) => {
      if(pod.id === id) {
        this.podInfo = pod;
      }
    });
    return this.podInfo;
  }
}

export const podStore = new PodStore();
