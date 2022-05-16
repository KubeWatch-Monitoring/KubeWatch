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
        manipulation: false,
        edges: {
            smooth: {
                type: "cubicBezier",
                forceDirection: "vertical",
                roundness: 0.8
            }
        },
        layout: {
            hierarchical: {
                enabled: true,
            },
        },
        interaction: {
            multiselect: true,
        },
        physics: {
            enabled: true,
            hierarchicalRepulsion: {
                avoidOverlap: 0.5
            }
        },
        nodes: {
            shape: "box",
            widthConstraint: {
                maximum: 100
            }
        }
    };
    new vis.Network(container, clusterData, options);
}

createNetwork();
