const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
let userDatabase = [];

chai.should();
chai.use(chaiHttp);

describe("Manage users", () => {
  describe("UC-201 add user /api/user", () => {
    beforeEach((done) => {
      userDatabase = [];
      done();
    });

    it("When a required input is missing, return an valid error.", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          lastName: "Spanjers",
          street: "Jagersberg",
          city: "Roosendaal",
          emailAdress: "sb.spanjers@gmail.com",
          password: "goed ww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be
            .a("string")
            .that.equals("Firstname must be a string.");
          done();
        });
    });
  });
});
