import sinon from "sinon";

export class Helpers {
    static getMockResponse() {
        const res = {
            status: {},
            end: sinon.spy(),
            redirect: sinon.spy(),
            render: sinon.spy(),
        };
        res.status = sinon.mock().returns(res);
        return res;
    }
}
