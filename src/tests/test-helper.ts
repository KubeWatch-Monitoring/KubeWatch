import sinon from "sinon";
import express from "express";

export class Helpers {
    static getMockResponse() {
        const res = {
            status: {},
            end: sinon.spy(),
            redirect: sinon.spy(),
            render: sinon.spy(),
            setHeader: sinon.spy(),
            write: sinon.spy(),
        };
        res.status = sinon.mock().returns(res);
        return res;
    }
    static getMockRequest(app: express.Express) {
        return {
            session: {
                style: {},
                display: {},
            },
            query: {},
            params: {},
            body: {},
            app
        }
    }
}
