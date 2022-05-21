import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../../app";
import {ClusterDataStoreImpl} from "../../../services/cluster-data-store-impl";
import {ClusterVisController} from "../../../view-controllers/cluster-vis-controller";
import {ControllerUtil} from "../../../utils/controller-util";
import {Edge, Vertex} from "../../../model/cluster-data";

describe("Cluster Data", () => {
    const controllerUtil = sinon.createStubInstance(ControllerUtil);
    const sendMockData = new ClusterVisController(controllerUtil);
    const URL = "/cluster-data"

    describe("sendData", () => {
        it("should return a valid DataSet on the front-end", async () => {
            const req: any = {
                session: {},
                display: {},
                originalUrl: URL,
                app
            };
            const res: any = {
                json: sinon.spy()
            };
            const mockVertices: Vertex[] = [
                {id: 1, label: "Node 1", level: 1},
                {id: 2, label: "Node 2", level: 2},
                {id: 3, label: "Node 3", level: 3},
                {id: 4, label: "Node 4", level: 4},
                {id: 5, label: "Node 5", level: 2},
            ];
            const mockEdges: Edge[] = [
                {from: 1, to: 3, },
                {from: 1, to: 2, },
                {from: 2, to: 4, },
                {from: 2, to: 5, },
                {from: 3, to: 3, },
            ];
            const mockClusterData = sinon.createStubInstance(ClusterDataStoreImpl);
            mockClusterData.getClusterData.resolves({vertices: mockVertices, edges: mockEdges});
            app.clusterDataStore = mockClusterData;

            await sendMockData.sendClusterData(req, res);
            expect(mockClusterData.getClusterData.called).matches;
            expect(res.json.called).to.be.true;
            expect(res.json.calledWithMatch(mockVertices, mockEdges)).to.be.equals;
        });
    });
});