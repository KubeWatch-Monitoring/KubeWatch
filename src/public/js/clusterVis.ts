const CLUSTER_DATA_URL = '/cluster-data';
const container = document.getElementById("my-network") as HTMLElement;

async function getJson(url: string) {
    return fetch(url, {
        method: 'get',
        headers: {
            'Access-Control-Allow-Origin': '*',
            Accept: 'application/json',
        }})
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Server not responding: ${response.status}`);
            }
            return response.json();
        })
        .catch((e) => Promise.reject(e));
}

async function getClusterData(): Promise<{nodes: vis.DataSet; edges: vis.DataSet}> {
    const data = await getJson(CLUSTER_DATA_URL);
    const nodes = data.nodes;
    const edges = data.edges;
    return {nodes, edges};
}

async function createNetwork(){
    const clusterData = await getClusterData();
    const container = document.getElementById("my-network") as HTMLElement;
    const options = {
        manipulation: false,
        height: "100%",
        layout: {
            hierarchical: {
                enabled: true,
                levelSeparation: 100,
            },
        },
        physics: {
            hierarchicalRepulsion: {
                nodeDistance: 100,
                avoidOverlap: 0.5,
            },
        },
    };
    const clusterNetwork = new vis.Network(container, clusterData, options);
}

createNetwork();

function localDevelopmentNetwork() {
    // create an array with nodes
    const nodes = new vis.DataSet<any>([
        { id: 1, label: "Cluster-1", level: 1 },

        { id: 2, label: "Node:\n Worker-2", level: 2 },
        { id: 3, label: "Node:\n Worker-1", level: 2 },
        { id: 4, label: "Node:\n Worker-Master", level: 2 },

        { id: 5, label: "Namespace:\n kubewatch", level: 3 },
        { id: 6, label: "Namespace:\n kube-system", level: 3 },
        { id: 7, label: "Namespace:\n kube-public", level: 3 },

        { id: 8, label: "Statefulset:\n mongoDB-kubewatch", level: 4 },
        { id: 9, label: "Deployment:\n nodejs-kubewatch", level: 4 },

        { id: 10, label: "Replicaset:\n mongoDB-kubewatch-asdf", level: 5 },
        { id: 11, label: "Replicaset:\n nodejs-kubewatch-abc", level: 5 },

        { id: 12, label: "Pod:\n mogoDB-kubewatch-asdf-12", level: 6 },
        { id: 13, label: "Pod:\n nodejs-kubewatch-abc-1", level: 6 },
        { id: 14, label: "Pod:\n nodejs-kubewatch-abc-2", level: 6 },
        { id: 15, label: "Pod:\n nodejs-kubewatch-abc-3", level: 6 },
    ]);

    // create an array with edges
    const edges = new vis.DataSet<any>([
        { from: 1, to: 2, arrows: "to" },
        { from: 1, to: 3, arrows: "to" },
        { from: 1, to: 4, arrows: "to" },
        { from: 2, to: 5, arrows: "to" },
        { from: 2, to: 6, arrows: "to" },
        { from: 2, to: 7, arrows: "to" },
        { from: 3, to: 5, arrows: "to" },
        { from: 3, to: 6, arrows: "to" },
        { from: 3, to: 7, arrows: "to" },
        { from: 4, to: 5, arrows: "to" },
        { from: 4, to: 6, arrows: "to" },
        { from: 4, to: 7, arrows: "to" },
        { from: 5, to: 8, arrows: "to" },
        { from: 5, to: 9, arrows: "to" },
        { from: 8, to: 10, arrows: "to" },
        { from: 10, to: 12, arrows: "to" },
        { from: 9, to: 11, arrows: "to" },
        { from: 11, to: 13, arrows: "to" },
        { from: 11, to: 14, arrows: "to" },
        { from: 11, to: 15, arrows: "to" },
    ]);
    // create a network
    const container = document.getElementById("my-network");
    const data = {
        nodes: nodes,
        edges: edges,
    };
    console.log(data);
    const options = {
        manipulation: false,
        height: "100%",
        layout: {
            hierarchical: {
                enabled: true,
                levelSeparation: 100,
            },
        },
        physics: {
            hierarchicalRepulsion: {
                nodeDistance: 100,
                avoidOverlap: 0.5,
            },
        },
    };
    const network = new vis.Network(container, data, options);
}

// localDevelopmentNetwork();