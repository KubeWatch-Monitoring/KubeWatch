export interface Vertex {
    id: number,
    label: string,
    level: number,
}

export interface Edge {
    from: number,
    to: number,
}

export interface ClusterData {
    vertices: Vertex[],
    edges: Edge[],
}

export interface KubernetesElement {
    type: ClusterType,
    level: number,
    query: string,
    label: string,
    ancestor: string,
    ancestorType: string
}

export interface ClusterDataStore {
    getClusterData(): Promise<ClusterData>;
}

export type ClusterType = | "Cluster" | "<none>" | "Node" | "Namespace" | "Deployment" | "Statefulset" | "DaemonSet" | "ReplicaSet" | "Pod" | "Container";

export const kubernetesElements: KubernetesElement[] = ([
    {type: "Cluster",       level: 1, query: "",                        label: "Cluster",       ancestor: "",           ancestorType: ""},
    {type: "<none>",        level: 1, query: "",                        label: "<none>",        ancestor: "",           ancestorType: ""},
    {type: "Node",          level: 2, query: "kube_node_labels",        label: "node",          ancestor: "Cluster",    ancestorType: "Cluster"},
    {type: "Namespace",     level: 3, query: "kube_namespace_labels",   label: "namespace",     ancestor: "minikube",   ancestorType: "Node"},
    {type: "Deployment",    level: 4, query: "kube_deployment_labels",  label: "deployment",    ancestor: "namespace",  ancestorType: "Namespace"},
    {type: "Statefulset",   level: 4, query: "kube_statefulset_labels", label: "statefulset",   ancestor: "namespace",  ancestorType: "Namespace"},
    {type: "DaemonSet",     level: 4, query: "kube_daemonset_labels",   label: "daemonset",     ancestor: "namespace",  ancestorType: "Namespace"},
    {type: "ReplicaSet",    level: 5, query: "kube_replicaset_owner",   label: "replicaset",    ancestor: "owner_name", ancestorType: "owner_kind"},
    {type: "Pod",           level: 6, query: "kube_pod_owner",          label: "pod",           ancestor: "owner_name", ancestorType: "owner_kind"},
    {type: "Container",     level: 7, query: "kube_pod_container_info", label: "container",     ancestor: "pod",        ancestorType: "Pod"},
]);
