import {ClusterData, ClusterDataStore} from "../model/cluster-data";
import {PrometheusService} from "./prometheus-service";

export class ClusterDataImpl implements ClusterDataStore {
    constructor(public prometheusService: PrometheusService) {
    }

    public async getClusterData() {
        return await this.createNetworkData();
    }

    public getClusterDataFromPrometheus() {
        return this.getPrometheusData();
    }

    private async createNodes() {
        const nodes = [
            {id: 1, label: "Cluster-1", level: 1},

            {id: 2, label: "Node:\n Worker-2", level: 2},
            {id: 3, label: "Node:\n Worker-1", level: 2},
            {id: 4, label: "Node:\n Worker-Master", level: 2},

            {id: 5, label: "Namespace:\n kubewatch", level: 3},
            {id: 6, label: "Namespace:\n kube-system", level: 3},
            {id: 7, label: "Namespace:\n kube-public", level: 3},

            {id: 8, label: "Statefulset:\n mongoDB-kubewatch", level: 4},
            {id: 9, label: "Deployment:\n nodejs-kubewatch", level: 4},

            {id: 10, label: "Replicaset:\n mongoDB-kubewatch-asdf", level: 5},
            {id: 11, label: "Replicaset:\n nodejs-kubewatch-abc", level: 5},

            {id: 12, label: "Pod:\n mogoDB-kubewatch-asdf-12", level: 6},
            {id: 13, label: "Pod:\n nodejs-kubewatch-abc-1", level: 6},
            {id: 14, label: "Pod:\n nodejs-kubewatch-abc-2", level: 6},
            {id: 15, label: "Pod:\n nodejs-kubewatch-abc-3", level: 6},
        ];
        return nodes;
    }

    private async createEdges() {
        const edges = [
            {from: 1, to: 2, arrows: "to"},
            {from: 1, to: 3, arrows: "to"},
            {from: 1, to: 4, arrows: "to"},
            {from: 2, to: 5, arrows: "to"},
            {from: 2, to: 6, arrows: "to"},
            {from: 2, to: 7, arrows: "to"},
            {from: 3, to: 5, arrows: "to"},
            {from: 3, to: 6, arrows: "to"},
            {from: 3, to: 7, arrows: "to"},
            {from: 4, to: 5, arrows: "to"},
            {from: 4, to: 6, arrows: "to"},
            {from: 4, to: 7, arrows: "to"},
            {from: 5, to: 8, arrows: "to"},
            {from: 5, to: 9, arrows: "to"},
            {from: 8, to: 10, arrows: "to"},
            {from: 10, to: 12, arrows: "to"},
            {from: 9, to: 11, arrows: "to"},
            {from: 11, to: 13, arrows: "to"},
            {from: 11, to: 14, arrows: "to"},
            {from: 11, to: 15, arrows: "to"},
        ];
        return edges;
    }

    private async createNetworkData() {
        return new ClusterData(
            await this.createNodes(),
            await this.createEdges()
        );
    }

    private async getPrometheusData() {
        const prometheusService = PrometheusService.connect(process.env.PROMETHEUS_CONN_STRING as string);
        const clusterData = await prometheusService.retrieveInstantQuery();
        clusterData.forEach((cluster) => {
            console.log(cluster.metric.labels.container);

        })
    }
}
