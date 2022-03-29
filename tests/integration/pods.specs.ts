import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { app } from "../../app";

chai.use(chaiHttp);

describe("/pods", function () {
  const URL = "/pods";
  it("responds with status 200", function (done) {
    chai
      .request(app)
      .get(URL)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "text/html; charset=utf-8");
        done();
      });
  });
});
describe("/pods/1", function () {
  const URL = "/pods/1";
  it("responds with status 200", function (done) {
    chai
      .request(app)
      .get(URL)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header("content-type", "text/html; charset=utf-8");
        done();
      });
  });
});
