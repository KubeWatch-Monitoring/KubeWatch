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
    ancestorType: string,
    alternativeAncestor: string,
    alternativeAncestorType: string,
}

export interface ClusterDataStore {
    getClusterData(): Promise<ClusterData>;
}

export type ClusterType = | "Cluster" | "Node" | "Namespace" | "Deployment" | "Statefulset" | "DaemonSet" | "ReplicaSet" | "Pod" | "Container" | "Job" | "CronJob";

export const kubernetesElements: KubernetesElement[] = ([
    {type: "Cluster",       level: 1, query: "",                        label: "Cluster",       ancestor: "",           ancestorType: "",            alternativeAncestor: "",           alternativeAncestorType: ""},
    {type: "Node",          level: 2, query: "kube_node_labels",        label: "node",          ancestor: "Cluster",    ancestorType: "Cluster",     alternativeAncestor: "",           alternativeAncestorType: ""},
    {type: "Namespace",     level: 3, query: "kube_namespace_labels",   label: "namespace",     ancestor: "minikube",   ancestorType: "Node",        alternativeAncestor: "",           alternativeAncestorType: ""},
    {type: "Deployment",    level: 4, query: "kube_deployment_labels",  label: "deployment",    ancestor: "namespace",  ancestorType: "Namespace",   alternativeAncestor: "",           alternativeAncestorType: ""},
    {type: "Statefulset",   level: 4, query: "kube_statefulset_labels", label: "statefulset",   ancestor: "namespace",  ancestorType: "Namespace",   alternativeAncestor: "",           alternativeAncestorType: ""},
    {type: "DaemonSet",     level: 4, query: "kube_daemonset_labels",   label: "daemonset",     ancestor: "namespace",  ancestorType: "Namespace",   alternativeAncestor: "",           alternativeAncestorType: ""},
    {type: "CronJob",       level: 4, query: "kube_cronjob_labels",     label: "cronjob",       ancestor: "namespace",  ancestorType: "Namespace",   alternativeAncestor: "",           alternativeAncestorType: ""},
    {type: "Job",           level: 5, query: "kube_job_owner",          label: "job_name",      ancestor: "owner_name", ancestorType: "owner_kind",  alternativeAncestor: "namespace",  alternativeAncestorType: "Namespace"},
    {type: "ReplicaSet",    level: 5, query: "kube_replicaset_owner",   label: "replicaset",    ancestor: "owner_name", ancestorType: "owner_kind",  alternativeAncestor: "namespace",  alternativeAncestorType: "Namespace"},
    {type: "Pod",           level: 6, query: "kube_pod_owner",          label: "pod",           ancestor: "owner_name", ancestorType: "owner_kind",  alternativeAncestor: "namespace",  alternativeAncestorType: "Namespace"},
    {type: "Container",     level: 7, query: "kube_pod_container_info", label: "container",     ancestor: "pod",        ancestorType: "Pod",         alternativeAncestor: "namespace",  alternativeAncestorType: "Namespace"},
]);
