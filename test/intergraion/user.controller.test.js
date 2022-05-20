process.env.DB_DATABASE = process.env.DB_DATABASE || "shareamealtestdb";

const { request } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const dbconnection = require("../../database/dbconnection");

chai.should();
chai.use(chaiHttp);

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJpYXQiOjE2NTMwNDA1OTgsImV4cCI6MTY1NDA3NzM5OH0.GeNga3pvswkXkTyNrZzuQGyjG8RDXCChcDs1XV25C7c";
const user1 = `INSERT INTO user (id ,firstName, lastName, isActive, emailAdress, password, street, city) VALUES (44, 'test', 'test', 1, 'test.mail@gmail.com', '$2b$10$e3hfgNgG.kSu4NU2S1xjv.Z/DHYmb5p3xszXkVw/tws5qfPkxSqcm', 'test', 'test')`;
const user2 = `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, street, city) VALUES ('test2', 'test2', 0, 'test2.mail@gmail.com', '$2b$10$e3hfgNgG.kSu4NU2S1xjv.Z/DHYmb5p3xszXkVw/tws5qfPkxSqcm', 'test', 'test')`;

describe("Manage users", () => {
  before(() => {
    dbconnection.query("DELETE FROM user");
  });

  afterEach(() => {
    dbconnection.query("DELETE FROM user");
  });

  // UC-101
  describe("UC-101 Login", () => {
    beforeEach((done) => {
      done();
    });

    // verplicht veld ontbreekt
    it("UC-101-1 Missing field, return error", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          emailAdress: "test.mail@gmail.com",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("password must be a string.");
          done();
        });
    });

    // niet valide email
    it("UC-101-2 Not a valid email, return error", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          emailAdress: "abc ik stop ermee",
          password: "testww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be.a("string").that.equals("Emailadress is not valid");
          done();
        });
    });

    // niet valide wachtwoord
    it("UC-101-3 Not a valid password, return error", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          emailAdress: "test.mail@gmail.com",
          password: 123,
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("password must be a string.");
          done();
        });
    });

    // gebruiker bestaat niet
    it("UC-101-4 User does not exist, return error", (done) => {
      chai
        .request(server)
        .post("/api/auth/login")
        .send({
          emailAdress: "deze.email@bestaat.niet",
          password: "stijnww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be.a("string").that.equals("User not found");
          done();
        });
    });

    // gebruiker succesvol ingelogd
    it("UC-101-5 User succesfull logged in, return result", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .post("/api/auth/login")
          .send({
            emailAdress: "test.mail@gmail.com",
            password: "stijnww",
          })
          .end((err, res) => {
            res.should.be.an("object");
            let { status, results } = res.body;
            const firstName = results.firstName;
            status.should.equals(200);
            results.should.be.a("object");
            firstName.should.be.a("string").that.equals("test");
            done();
          });
      });
    });
  });

  // UC-201
  describe("UC-201 add user /api/user", () => {
    beforeEach((done) => {
      done();
    });

    // missing an input
    it("UC-201-1 When a required input is missing, return an valid error.", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          lastName: "test",
          street: "test",
          city: "test",
          emailAdress: "test.mail@gmail.com",
          password: "testww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("Firstname must be a string.");
          done();
        });
    });

    // email not a string
    it("UC-201-2 When email-address is not valid, return valid error.", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "test",
          lastName: "test",
          street: "test",
          city: "test",
          emailAdress: 1234,
          password: "testww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be.a("string").that.equals("Emailadress is not valid");
          done();
        });
    });

    // non valid password
    it("UC-201-3 When password is not valid, return an valid error.", (done) => {
      chai
        .request(server)
        .post("/api/user")
        .send({
          firstName: "test",
          lastName: "test",
          street: "test",
          city: "test",
          emailAdress: "test.mail@gmail.com",
          password: 1029,
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("Password must be a string.");
          done();
        });
    });

    // user already exists
    it("UC-201-4 When user already exists, return an valid error.", (done) => {
      dbconnection.query(user1, () => {
        const newUser = {
          firstName: "Stijn",
          lastName: "Spanjers",
          street: "Jagersberg",
          city: "Roosendaal",
          emailAdress: "test.mail@gmail.com",
          password: "testww",
        };

        chai
          .request(server)
          .post("/api/user")
          .send(newUser)
          .end((err, res) => {
            res.should.be.an("object");
            let { status, message } = res.body;
            status.should.equals(409);
            message.should.be.a("string").that.equals("Email already in use.");
            done();
          });
      });
    });

    // user added succesfull
    it("UC-201-5 When user is added, return a valid responce.", (done) => {
      const user = {
        firstName: "Goede",
        lastName: "gebruiker",
        street: "straat",
        city: "stad",
        emailAdress: "goed.mail@gmail.com",
        password: "goedww",
      };

      chai
        .request(server)
        .post("/api/user")
        .send(user)
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result, userId } = res.body;
          status.should.equals(201);
          result.should.be.a("string").that.equals("User added");
          newId = userId;
          done();
        });
    });
  });

  // UC-202
  describe("UC-202 Overzicht users /api/user", () => {
    beforeEach((done) => {
      done();
    });

    // 0 users
    it("UC-202-1 When there are 0 users, show empty JSON", (done) => {
      chai
        .request(server)
        .get("/api/user")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          const users = result.length;
          users.should.equals(0);
          status.should.equals(200);
          result.should.be.a("array");
          done();
        });
    });

    // 2 users
    it("UC-202-2 When there are 2 users, show JSON with 2 users", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(user2, () => {
          chai
            .request(server)
            .get("/api/user")
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
              res.should.be.an("object");
              let { status, result } = res.body;
              const users = result.length;
              users.should.equals(2);
              status.should.equals(200);
              result.should.be.a("array");
              done();
            });
        });
      });
    });

    // zoekterm niet bestaande gebruiker
    it("UC-202-3 Not existing user to find, return JSON", (done) => {
      chai
        .request(server)
        .get("/api/user/?firstName=Appeltaart")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          const amount = result.length;
          amount.should.equals(0);
          status.should.equals(200);
          result.should.be.a("array");
          done();
        });
    });

    // zoekterm niet active
    it("UC-202-4 Search on not active, return JSON", (done) => {
      dbconnection.query(user2, () => {
        chai
          .request(server)
          .get("/api/user/?isActive=0")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.be.an("object");
            let { status, result } = res.body;
            const amount = result.length;
            amount.should.equals(1);
            status.should.equals(200);
            result.should.be.a("array");
            done();
          });
      });
    });

    // zoekterm active
    it("UC-202-4 Search on active, return JSON", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .get("/api/user/?isActive=0")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.be.an("object");
            let { status, result } = res.body;
            const amount = result.length;
            amount.should.equals(1);
            status.should.equals(200);
            result.should.be.a("array");
            done();
          });
      });
    });

    // zoekterm niet bestaande gebruiker
    it("UC-202-3 existing user to find, return JSON", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .get("/api/user/?firstName=test")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.be.an("object");
            let { status, result } = res.body;
            const amount = result.length;
            amount.should.equals(1);
            status.should.equals(200);
            result.should.be.a("array");
            done();
          });
      });
    });
  });

  // UC - 203;
  describe("UC-203 Gebruikersprogiel opvragen /api/user/profile", () => {
    beforeEach((done) => {
      done();
    });

    // invalide token
    it("UC-201-1 Non valid token, return a valid error.", (done) => {
      chai
        .request(server)
        .get("/api/user/profile")
        .set({ Authorization: `Bearer 1234` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be.a("string").that.equals("Not authorized");
          done();
        });
    });

    // valide token
    it("UC-201-2 Valid token, return user.", (done) => {
      dbconnection.query(user1);
      chai
        .request(server)
        .get("/api/user/profile")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          const firstName = result.firstName;
          status.should.equals(200);
          result.should.be.a("object");
          firstName.should.be.a("string").that.equals("test");
          done();
        });
    });
  });

  // UC-204
  describe("UC-204 Details van gebruiker /api/user/:userId", () => {
    beforeEach((done) => {
      done();
    });

    // ongeldig token
    it("UC-204-1 Not a valid token, return a valid error", (done) => {
      chai
        .request(server)
        .get("/api/user/1")
        .set({ Authorization: `Bearer 1234` })
        .end((err, res) => {
          res.should.be.a("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be.a("string").that.equals("Not authorized");
          done();
        });
    });

    // ongeldige userID
    it("UC-204-2 When the userId does not exist, return a valid error", (done) => {
      chai
        .request(server)
        .get("/api/user/99999")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.a("object");
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be
            .a("string")
            .that.equals("User with ID 99999 not found");
          done();
        });
    });

    // geldige userID
    it("UC-204-3 When the userId exists, return a valid responce", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .get("/api/user/44")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.be.a("object");
            let { status, result } = res.body;
            const firstName = result.firstName;
            status.should.equals(200);
            result.should.be.an("object");
            firstName.should.be.a("string").that.equals("test");
            done();
          });
      });
    });
  });

  // UC-205
  describe("UC-205 Gebruiker wijzigen /api/user/:userId", () => {
    beforeEach((done) => {
      done();
    });

    // Verplicht veld ontbreekt
    it("UC-205-1 When a field is missing, return valid error", (done) => {
      chai
        .request(server)
        .put("/api/user/1")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          lastName: "test",
          street: "test",
          city: "test",
          emailAdress: "test.mail@gmail.com",
          password: "testww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("Firstname must be a string.");
          done();
        });
    });

    // niet valide telefoonnummer
    it("UC-205-3 When the phonenumber is not valid, return valid error", (done) => {
      chai
        .request(server)
        .put("/api/user/1")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          firstName: "test",
          lastName: "test",
          street: "test",
          city: "test",
          phoneNumber: 123,
          emailAdress: "test.mail@gmail.com",
          password: "testww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be.a("string").that.equals("Phonenumber is not valid");
          done();
        });
    });

    // gebruiker bestaat niet
    it("UC-205-4 When the user doesn't exist, return valid error", (done) => {
      chai
        .request(server)
        .put("/api/user/44")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          firstName: "test",
          lastName: "test",
          street: "test",
          city: "test",
          phoneNumber: "06-test",
          emailAdress: "test.mail@gmail.com",
          password: "testww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be
            .a("string")
            .that.equals("User with provided id does not exist");
          done();
        });
    });

    // niet ingelogd

    it("UC-205-4 When the user isn't logged in, return valid error", (done) => {
      chai
        .request(server)
        .put("/api/user/99999")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          firstName: "test",
          lastName: "test",
          street: "test",
          city: "test",
          phoneNumber: "06-test",
          emailAdress: "test.mail@gmail.com",
          password: "testww",
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(403);
          message.should.be
            .a("string")
            .that.equals(
              "You can't change this account, because it is not yours"
            );
          done();
        });
    });

    // gebruiker succesvol gewijzigd
    it("UC-205-6 When the user does exist, return valid responce", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .put("/api/user/44")
          .set({ Authorization: `Bearer ${token}` })
          .send({
            firstName: "veranderde naam",
            lastName: "test",
            street: "test",
            city: "test",
            phoneNumber: "06-test",
            emailAdress: "test.mail@gmail.com",
            password: "testww",
          })
          .end((err, res) => {
            res.should.be.an("object");
            let { status, message } = res.body;
            status.should.equals(200);
            message.should.be
              .a("string")
              .that.equals("User successfull changed");
            done();
          });
      });
    });
  });

  // UC-206
  describe("UC-206 Gebruiker verwijderen /api/user/:userId", () => {
    beforeEach((done) => {
      done();
    });

    // gebruiker bestaat niet
    it("UC-206-1 When user doesn't exists, return valid error", (done) => {
      chai
        .request(server)
        .delete("/api/user/44")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be.a("string").that.equals("User doesn't exist");
          done();
        });
    });

    // niet ingelogd
    it("UC-206-1 User not logged in, return valid error", (done) => {
      chai
        .request(server)
        .delete("/api/user/44")
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(401);
          message.should.be
            .a("string")
            .that.equals("Authorization header missing!");
          done();
        });
    });

    // Actor is geen eigenaar
    it("UC-206-1 User not logged in, return valid error", (done) => {
      chai
        .request(server)
        .delete("/api/user/9999")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(403);
          message.should.be
            .a("string")
            .that.equals(
              "You can't delete this account, because it is not yours"
            );
          done();
        });
    });

    // Gebruiker succesvol verwijderd
    it("UC-206-4 When user is removed, return valid responce", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .delete(`/api/user/44`)
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            const { status, message } = res.body;
            status.should.equals(200);
            message.should.be
              .a("string")
              .that.equals("User successfull deleted");
            done();
          });
      });
    });
  });
});
