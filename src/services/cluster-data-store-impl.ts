import {ClusterData, ClusterDataStore, IClusterVisParams, kubeTypes} from "../model/cluster-data";
import {PrometheusService} from "./prometheus-service";
import {MongoDbService} from "./mongo-db-service";
import {Collection, ObjectId} from "mongodb";

export class ClusterDataStoreImpl implements ClusterDataStore {
    constructor(private prometheusService: PrometheusService) {
        this.prometheusService = PrometheusService.connect(process.env.PROMETHEUS_CONN_STRING as string);
    }
    // private clusterDataCollection: Collection;
    //
    // constructor(private prometheusService: PrometheusService, private mongoDbService: MongoDbService) {
    //     this.clusterDataCollection = mongoDbService.db.collection("notifications");
    // }
    //
    // private async addClusterData(clusterData: IClusterVisParams) {
    //     return await this.clusterDataCollection.insertOne(clusterData) as unknown as Notification;
    // }

    public async getClusterData() {
        return await this.createNetworkData();
    }

    private async getPrometheusData(query: string, queryParameters: IClusterVisParams) {

        let clusterData = [];
        try {
            clusterData = await this.prometheusService.retrieveGroupByInstantQuery(query, queryParameters);
        } catch (err) {
            console.log("bad query", err);
        }
        return clusterData;
    }

    private async getClusterDataFromPrometheus() {
        const vertices = [
            {id: 0, type: "Cluster", level: 1, label: "Cluster", ancestor: "", ancestorType: ""}];
        let uuid = 1;   // sooo ugly, change to proper mongodb entry
        let result;
        for (const e of kubeTypes) {
            const params: IClusterVisParams = {
                label: e.label,
                ancestor: e.ancestor,
                ancestorType: e.ancestorType
            }
            // console.log("*******************");
            // console.log(e.type.toUpperCase());
            // console.log(e.query);
            // console.log(params);
            result = await this.getPrometheusData(e.query, params);
            result.forEach((r:any) => {
                vertices.push({
                    id: uuid++,
                    type: e.type,
                    level: e.level,
                    label: r.metric.labels[e.label] ? r.metric.labels[e.label] : e.label,
                    ancestor: r.metric.labels[e.ancestor] ? r.metric.labels[e.ancestor] : e.ancestor,
                    ancestorType: r.metric.labels[e.ancestorType] ? r.metric.labels[e.ancestorType] : e.ancestorType,
                });
                // console.log(r.metric.labels);
            })
        }
        return vertices;
    }

    private async createNodes() {
        const vertices = await this.getClusterDataFromPrometheus();
        let nodes = [
            {id: 0, label: "Cluster:\nCluster",  level: 1}];
        nodes.pop(); // soooo ugly
        vertices.forEach((v) => {
            nodes.push({
                id: v.id,
                label: `${v.type}:\n${v.label}`,
                level: v.level,
            });
        })
        // console.log(nodes);
        // nodes = [
        //     {id: 1, label: "Cluster-1", level: 1},
        //
        //     {id: 2, label: "Node:\n Worker-2", level: 2},
        //     {id: 3, label: "Node:\n Worker-1", level: 2},
        //     {id: 4, label: "Node:\n Worker-Master", level: 2},
        //
        //     {id: 5, label: "Namespace:\n kubewatch", level: 3},
        //     {id: 6, label: "Namespace:\n kube-system", level: 3},
        //     {id: 7, label: "Namespace:\n kube-public", level: 3},
        //
        //     {id: 8, label: "Statefulset:\n mongoDB-kubewatch", level: 4},
        //     {id: 9, label: "Deployment:\n nodejs-kubewatch", level: 4},
        //
        //     {id: 10, label: "Replicaset:\n mongoDB-kubewatch-asdf", level: 5},
        //     {id: 11, label: "Replicaset:\n nodejs-kubewatch-abc", level: 5},
        //
        //     {id: 12, label: "Pod:\n mogoDB-kubewatch-asdf-12", level: 6},
        //     {id: 13, label: "Pod:\n nodejs-kubewatch-abc-1", level: 6},
        //     {id: 14, label: "Pod:\n nodejs-kubewatch-abc-2", level: 6},
        //     {id: 15, label: "Pod:\n nodejs-kubewatch-abc-3", level: 6},
        // ]
        console.log(vertices);
        console.log(nodes);
        return {nodes, vertices};

    }

    private async createEdges() {
        const {nodes, vertices} = await this.createNodes();
        let edges = [{from: 0, to: 0, arrows: "to"}];
        edges.pop();  //soooo ugly

        for (const v of vertices.reverse()) {
            // console.log("1", nodes.forEach(e => e.label));
            // console.log("2", `${v.ancestorType}:\n${v.ancestor}`);
            const indexTarget = nodes.find(e => e.label === `${v.ancestorType}:\n${v.ancestor}`);
            if(indexTarget){
                edges.push(
                    {from: v.id, to: nodes[indexTarget.id].id, arrows: "from"}
                );}
            }
        // console.log(edges);
        // edges = [
        //     {from: 1, to: 2, arrows: "to"},
        //     {from: 1, to: 3, arrows: "to"},
        //     {from: 1, to: 4, arrows: "to"},
        //     {from: 2, to: 5, arrows: "to"},
        //     {from: 2, to: 6, arrows: "to"},
        //     {from: 2, to: 7, arrows: "to"},
        //     {from: 3, to: 5, arrows: "to"},
        //     {from: 3, to: 6, arrows: "to"},
        //     {from: 3, to: 7, arrows: "to"},
        //     {from: 4, to: 5, arrows: "to"},
        //     {from: 4, to: 6, arrows: "to"},
        //     {from: 4, to: 7, arrows: "to"},
        //     {from: 5, to: 8, arrows: "to"},
        //     {from: 5, to: 9, arrows: "to"},
        //     {from: 8, to: 10, arrows: "to"},
        //     {from: 10, to: 12, arrows: "to"},
        //     {from: 9, to: 11, arrows: "to"},
        //     {from: 11, to: 13, arrows: "to"},
        //     {from: 11, to: 14, arrows: "to"},
        //     {from: 11, to: 15, arrows: "to"},
        // ]
        console.log(edges);
        return edges;
    }

    private async createNetworkData():Promise<ClusterData> {
        const {nodes} = await this.createNodes();
        return new ClusterData(
            nodes,
            await this.createEdges()
        );
    }
}
