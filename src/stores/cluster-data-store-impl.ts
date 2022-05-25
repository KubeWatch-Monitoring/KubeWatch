import {
    ClusterData,
    ClusterDataStore,
    Edge,
    KubernetesElement,
    kubernetesElements,
    Vertex
} from "../model/cluster-data";
import {PrometheusService} from "../services/prometheus-service";


export class ClusterDataStoreImpl implements ClusterDataStore {
    constructor(private prometheusService: PrometheusService) {
    }

    public async getClusterData(): Promise<ClusterData> {
        const elements = await this.getClusterDataFromPrometheus();
        const vertices = await this.createNodes(elements);
        const edges = await this.createEdges(elements, vertices);
        return {vertices, edges};
    }

    private async getClusterDataFromPrometheus() {
        let id = 0;
        const elements: (KubernetesElement & Vertex)[] = [];
        for (const element of kubernetesElements) {
            let result;
            try {
                result = await this.prometheusService.retrieveGroupByInstantQuery(element);
            } catch (err) {
                result = [{ metric: { labels: { } }}];
            }
            result.forEach((r: any) => {
                elements.push({
                    id: id++,
                    type: element.type,
                    level: element.level,
                    label: r.metric.labels[element.label] ?? element.label,
                    ancestor: r.metric.labels[element.ancestor] ?? element.ancestor,
                    ancestorType: r.metric.labels[element.ancestorType] ?? element.ancestorType,
                    query: "",
                });
            })
        }
        return elements;
    }

    private async createNodes(elements: (KubernetesElement & Vertex)[]) {
        const nodes: Vertex[] = [];
        elements.forEach((v) => {
            nodes.push({
                id: v.id,
                label: `${v.type}:\n${v.label}`,
                level: v.level,
            });
        });
        return nodes;
    }

    private async createEdges(elements: (KubernetesElement & Vertex)[], nodes: Vertex[]) {
        const edges: Edge[] = [];
        for (const element of elements) {
            const indexTarget = nodes.find(node => node.label === `${element.ancestorType}:\n${element.ancestor}`);
            if (indexTarget) {
                edges.push(
                    {from: element.id, to: nodes[indexTarget.id].id}
                );
            }
        }
        return edges;
    }
}
