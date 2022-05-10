const { request } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
let newId = 0;

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
    it("When user is added, return a valid responce.", (done) => {
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
          let { status, result, userId } = res.body;
          status.should.equals(200);
          result.should.be.a("string").that.equals("User added");
          newId = userId;
          console.log(newId);
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
  describe("UC-203 Gebruikersprogiel opvragen /api/user/profile/:userId", () => {
    beforeEach((done) => {
      done();
    });

    // deze methode is nog niet geimplementeerd
  });

  // UC-204
  describe("UC-204 Details van gebruiker /api/user/:userId", () => {
    beforeEach((done) => {
      done();
    });

    // ongeldig token -> daar werken we nog niet mee

    // ongeldige userID
    it("When the userId is not valid, return a valid error", (done) => {
      chai
        .request(server)
        .get("/api/user/999")
        .end((err, res) => {
          res.should.be.a("object");
          let { status, result } = res.body;
          status.should.equals(404);
          result.should.be
            .a("string")
            .that.equals("User with ID 999 not found");
          done();
        });
    });

    // geldige userID
    it("When the token is valid, return a valid responce", (done) => {
      chai
        .request(server)
        .get("/api/user/4")
        .end((err, res) => {
          res.should.be.a("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be.an("object");
          done();
        });
    });
  });

  // UC-205
  describe("UC-205 Gebruiker wijzigen /api/user/:userId", () => {
    beforeEach((done) => {
      done();
    });

    // Verplicht veld ontbreekt
    it("When a field is missing, return valid error", (done) => {
      chai
        .request(server)
        .put("/api/user/41")
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

    // niet valide postcode

    // niet valide email

    // gebruiker bestaat niet
    it("When the user doesn't exist, return valid error", (done) => {
      chai
        .request(server)
        .put("/api/user/999")
        .send({
          firstName: "Stijn",
          lastName: "Spanjers",
          street: "Jagersberg",
          city: "Roosendaal",
          emailAdress: "sb.spanjers@gmail.com",
          password: "goed ww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(404);
          result.should.be
            .a("string")
            .that.equals("User with provided id does not exist");
          done();
        });
    });

    // niet ingelogd

    // gebruiker succesvol gewijzigd
    // als de test 1x is uitgevoerd moet hier een van de attributen verandert worden, anders werkt de test niet juist.
    it("When the user does exist, return valid responce", (done) => {
      chai
        .request(server)
        .put("/api/user/41")
        .send({
          firstName: "Stijn",
          lastName: "Spanjers",
          street: "Jagersberg",
          city: "Roosendaal",
          emailAdress: "sb.spanjers@gmail.com",
          password: "beter ww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(200);
          result.should.be.a("string").that.equals("User successfull changed");
          done();
        });
    });
  });

  // UC-206
  describe("UC-206 Gebruiker verwijderen /api/user/:userId", () => {
    beforeEach((done) => {
      done();
    });

    // gebruiker bestaat niet
    it("When user doesn't exists, return valid error", (done) => {
      chai
        .request(server)
        .delete("/api/user/999")
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          status.should.equals(404);
          result.should.be.a("string").that.equals("User has not been deleted");
          done();
        });
    });

    // niet ingelogd

    // Actor is geen eigenaar

    // Gebruiker succesvol verwijderd
    it("When user is removed, return valid responce", (done) => {
      console.log("newId = " + newId);
      chai
        .request(server)
        .delete(`/api/user/${newId}`)
        .end((err, res) => {
          const { status, result } = res.body;
          status.should.equals(200);
          result.should.be.a("string").that.equals("User successfull deleted");
          done();
        });
    });
  });
});
