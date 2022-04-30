const { request } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
let userDatabase = [];

chai.should();
chai.use(chaiHttp);

describe("Manage users", () => {
  // UC-201
  describe("UC-201 add user /api/user", () => {
    beforeEach((done) => {
      done();
    });

    // missing an input
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

    // email not a string
    it("When email-address is not valid, return valid error.", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "Stijn",
          lastName: "Spanjers",
          street: "Jagersberg",
          city: "Roosendaal",
          emailAdress: 1234,
          password: "goed ww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be.a("string").that.equals("Email must be a string.");
          done();
        });
    });

    // non valid password
    it("When password is not valid, return an valid error.", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "Stijn",
          lastName: "Spanjers",
          street: "Jagersberg",
          city: "Roosendaal",
          emailAdress: "sb.spanjers@gmail.com",
          password: 1029,
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(400);
          result.should.be
            .a("string")
            .that.equals("Password must be a string.");
          done();
        });
    });

    // user already exists
    it("When user already exists, return an valid error.", (done) => {
      const newUser = {
        firstName: "Stijn",
        lastName: "Spanjers",
        street: "Jagersberg",
        city: "Roosendaal",
        emailAdress: "sb.spanjers@gmail.com",
        password: "goed ww",
      };

      chai
        .request(server)
        .post("/api/user")
        .send(newUser)
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(404);
          result.should.be.a("string").that.equals("Email already in use.");
          done();
        });
    });

    // user added succesfull
    it("When user is added, return an valid responce.", (done) => {
      const user = {
        firstName: "test",
        lastName: "test",
        street: "test",
        city: "test",
        emailAdress: "test@mail.com",
        password: "test ww",
      };

      chai
        .request(server)
        .post("/api/user")
        .send(user)
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be.a("string").that.equals("User added");
          done();
        });
    });
  });

  // UC-202
  describe("UC-202 Overzicht users /api/user", () => {
    beforeEach((done) => {
      done();
    });

    // IDK of ik telkens heel de database leeg moet gooien ofzo om dit te testen. Maar dit werkt
    it("When there are 0 users, show empty JSON", (done) => {
      chai
        .request(server)
        .get("/api/user")
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be.a("array");
          done();
        });
    });

    // zoeken op niet bestaand ID

    // actief op false????

    // actief op true????

    // zoeken op bestaand ID
  });
  // UC-203

  // UC-204

  // UC-205

  // UC-206
});
