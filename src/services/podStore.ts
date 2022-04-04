import { Pod } from "../model/pod";
import { MetricsData } from "../model/metrics-data";

export class PodStore {
  private getRandomPods() {
    return [
      new Pod(
        1,
        "My Database Pod",
        "Some Description",
        new MetricsData(
          Math.floor(Math.random() * 101),
          Math.floor(Math.random() * 101),
          Math.floor(Math.random() * 101)
        )
      ),
      new Pod(
        2,
        "My Webserver Pod",
        "Some Description",
        new MetricsData(
          Math.floor(Math.random() * 101),
          Math.floor(Math.random() * 101),
          Math.floor(Math.random() * 101)
        )
      ),
      new Pod(
        3,
        "My Redis Pod",
        "Some Description",
        new MetricsData(
          Math.floor(Math.random() * 101),
          Math.floor(Math.random() * 101),
          Math.floor(Math.random() * 101)
        )
      ),
    ];
  }
  async getAllPods() {
    return this.getRandomPods();
  }

  async getPodById(id: number) {
    const allPods = this.getRandomPods();

    if (id < 0 || id > allPods.length) {
      throw new Error(`Pod with ID ${id} does not exist`);
    }
    return allPods[id];
  }
}

export const podStore = new PodStore();
