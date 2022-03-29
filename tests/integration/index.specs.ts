import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import { app } from "../../app";

chai.use(chaiHttp);

describe("Index", function () {
  describe("/", function () {
    const URL = "/";
    it("responds with status 200", function (done) {
      chai
        .request(app)
        .get("/")
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.have.header(
            "content-type",
            "text/html; charset=utf-8"
          );
          done();
        });
    });
  });
});
