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
const meal1 = `INSERT INTO meal (id, name, description, price, maxAmountOfParticipants ,isActive, isVega, isVegan, isToTakeHome, imageUrl, cookId, allergenes, dateTime) VALUES (15, 'test', 'test', 5, 5, 1, 0, 0, 1, 'test', 44, 'gluten', '1000-01-01T00:00:00.000')`;
const join1 = `INSERT INTO meal_participants_user (mealId, userId) VALUES (15, 44)`;

describe("Manage participants", () => {
  before(() => {
    dbconnection.query("DELETE IGNORE FROM meal_participants_user");
    dbconnection.query("DELETE IGNORE FROM meal");
    dbconnection.query("DELETE IGNORE FROM user");
  });

  afterEach((done) => {
    dbconnection.query("DELETE IGNORE FROM meal_participants_user");
    dbconnection.query("DELETE IGNORE FROM meal");
    dbconnection.query("DELETE IGNORE FROM user");
    done();
  });

  describe("UC-401 Join meal", () => {
    beforeEach((done) => {
      done();
    });

    // niet ingelogd
    it("UC-401-1 Not logged in, return error", (done) => {
      chai
        .request(server)
        .post("/api/participate/15")
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

    // maaltijd bestaat niet
    it("UC-401-2 Meal doesn't exist, return error", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .post("/api/participate/15")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.be.an("object");
            let { status, message } = res.body;
            status.should.equals(404);
            message.should.be.a("string").that.equals("Meal doesn't exist");
            done();
          });
      });
    });

    // succesvol
    it("UC-401-3 Joined succesfull, return result", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(meal1, () => {
          chai
            .request(server)
            .post("/api/participate/15")
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
              res.should.be.an("object");
              let { status, message } = res.body;
              status.should.equals(200);
              message.should.be.a("string").that.equals("You joined the meal.");
              done();
            });
        });
      });
    });
  });

  describe("UC-402 Leave meal", () => {
    beforeEach((done) => {
      done();
    });

    // niet ingelogd
    it("UC-402-1 Not logged in, return error", (done) => {
      chai
        .request(server)
        .delete("/api/participate/15")
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

    // maaltijd bestaat niet
    it("UC-402-2 Meal doesn't exist, return error", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .delete("/api/participate/15")
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.be.an("object");
            let { status, message } = res.body;
            status.should.equals(404);
            message.should.be.a("string").that.equals("Meal doesn't exist.");
            done();
          });
      });
    });

    // succesvol
    it("UC-402-3 Left succesfull, return result", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(meal1, () => {
          dbconnection.query(join1, () => {
            chai
              .request(server)
              .delete("/api/participate/15")
              .set({ Authorization: `Bearer ${token}` })
              .end((err, res) => {
                res.should.be.an("object");
                let { status, message } = res.body;
                status.should.equals(200);
                message.should.be
                  .a("string")
                  .that.equals("You left the meal with id 15.");
                done();
              });
          });
        });
      });
    });
  });
});
