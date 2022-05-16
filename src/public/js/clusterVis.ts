const CLUSTER_DATA_URL = '/cluster-visualisation/data';

async function getJson(url: string) {
    const response = await fetch(url, {
        method: 'get',
        headers: {
            Accept: 'application/json',
        }
    });
    if (!response.ok) {
        throw new Error(`Server not responding: ${response.status}`);
    }
    return response.json();
}

async function getClusterData(): Promise<{ nodes: any; edges: any }> {
    const data = await getJson(CLUSTER_DATA_URL);
    const vertices = data.vertices;
    const edges = data.edges;
    return {nodes: vertices, edges};
}

async function createNetwork() {
    const clusterData = await getClusterData();
    const container = document.getElementById("my-network") as HTMLElement;
    const options = {
        layout: {
            hierarchical: {
                enabled: true,
                treeSpacing: 300,
                levelSeparation: 100,
                nodeSpacing: 300,
            },
        },
        interaction: {
            multiselect: true,
            navigationButtons: true,
        },
        physics: {
            enabled: false,
        },
        nodes: {
            shape: "box",
        }
    };
    new vis.Network(container, clusterData, options);
}

createNetwork();
