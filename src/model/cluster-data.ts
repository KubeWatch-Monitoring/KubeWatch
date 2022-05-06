export class ClusterData {
    constructor(
        public nodes: {
            id: number,
            label: string,
            level: number,
        }[],
        public edges: {
            from: number,
            to: number,
            arrows: string,
        }[],
    ) {
    }
}

export interface ClusterDataStore {
    getClusterData(): Promise<ClusterData>;

    getClusterDataFromPrometheus(): Promise<void>;
}