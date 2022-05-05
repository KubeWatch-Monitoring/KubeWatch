import {expect} from "chai";
import sinon from "sinon";
import {app} from "../../app";
import {ClusterDataImpl} from "../../services/cluster-data-impl";
import {DataSet} from "vis-data";
import {ClusterDataController} from "../../view-controllers/cluster-data-controller";
import {ClusterData} from "../../model/cluster-data";

describe("Cluster Data", () => {
    // describe("retrieves correct data", () => {
    //     it("should return the same data", async () => {
    //         const mockNodes= [
    //             { id: 1, label: "Node 1", level: 1 },
    //             { id: 2, label: "Node 2", level: 2 },
    //             { id: 3, label: "Node 3", level: 3 },
    //             { id: 4, label: "Node 4", level: 4 },
    //             { id: 5, label: "Node 5", level: 2 },
    //         ];
    //         const mockEdges= [
    //             { from: 1, to: 3, arrows: "to", },
    //             { from: 1, to: 2, arrows: "to", },
    //             { from: 2, to: 4, arrows: "to", },
    //             { from: 2, to: 5, arrows: "to", },
    //             { from: 3, to: 999, arrows: "to", },
    //         ];
    //         const mockData = new ClusterData(mockNodes, mockEdges);
    //         const mockClusterData = sinon.createStubInstance(ClusterDataImpl);
    //         const data = mockClusterData.getClusterData.resolves(mockData);
    //         expect(data.returnValues).to.equal(mockData);
    //     })
    // })

    const sendMockData = new ClusterDataController();
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
            const mockNodes= [
                { id: 1, label: "Node 1", level: 1 },
                { id: 2, label: "Node 2", level: 2 },
                { id: 3, label: "Node 3", level: 3 },
                { id: 4, label: "Node 4", level: 4 },
                { id: 5, label: "Node 5", level: 2 },
            ];
            const mockEdges= [
                { from: 1, to: 3, arrows: "to", },
                { from: 1, to: 2, arrows: "to", },
                { from: 2, to: 4, arrows: "to", },
                { from: 2, to: 5, arrows: "to", },
                { from: 3, to: 3, arrows: "to", },
            ];
            const mockClusterData = sinon.createStubInstance(ClusterDataImpl);
            mockClusterData.getClusterData.resolves({nodes: mockNodes, edges: mockEdges});
            app.clusterData = mockClusterData;

            await sendMockData.sendClusterData(req, res);
            expect(mockClusterData.getClusterData.called).matches;
            expect(res.json.called).to.be.true;
            expect(res.json.calledWithMatch(mockNodes, mockEdges)).to.be.equals;
        });
    });
});