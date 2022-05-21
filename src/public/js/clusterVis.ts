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
    const boxDist = 100;
    const options = {
        layout: {
            hierarchical: {
                enabled: true,
                nodeSpacing: boxDist * 1.2,
                levelSeparation: boxDist * 2,
                sortMethod: "directed",
                parentCentralization: false,
                blockShifting: false,
                edgeMinimization: false,
                shakeTowards: "leaves",
            },
        },
        interaction: {
            multiselect: true,
        },
        physics: {
            enabled: false,
        },
        nodes: {
            shape: "box",
            widthConstraint: {
                minimum: boxDist,
                maximum: boxDist,
            },
            heightConstraint: {
                minimum: boxDist * (2/3),
            }
        }
    };
    new vis.Network(container, clusterData, options);
}

createNetwork();
