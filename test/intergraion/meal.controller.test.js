process.env.DB_DATABASE = process.env.DB_DATABASE || "shareamealtestdb";

const { request } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../index");
const dbconnection = require("../../database/dbconnection");

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQ0LCJpYXQiOjE2NTMwNDA1OTgsImV4cCI6MTY1NDA3NzM5OH0.GeNga3pvswkXkTyNrZzuQGyjG8RDXCChcDs1XV25C7c";
const user1 = `INSERT INTO user (id, firstName, lastName, isActive, emailAdress, password, street, city) VALUES (44, 'test', 'test', 1, 'test.mail@gmail.com', '$2b$10$e3hfgNgG.kSu4NU2S1xjv.Z/DHYmb5p3xszXkVw/tws5qfPkxSqcm', 'test', 'test')`;
const meal1 = `INSERT INTO meal (id, name, description, price, maxAmountOfParticipants,isActive, isVega, isVegan, isToTakeHome, imageUrl, cookId, allergenes, dateTime) VALUES (15, 'test', 'test', 5, 5, 1, 0, 0, 1, 'test', 44, 'test', '1000-01-01 00:00:00')`;

chai.should();
chai.use(chaiHttp);

describe("Manage meals", () => {
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

  describe("UC-301 Make meal", () => {
    beforeEach((done) => {
      done();
    });

    // verplicht veld ontbreekt
    it("UC-301-1 Missing name, return valid error", (done) => {
      chai
        .request(server)
        .post("/api/meal")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          description: "test",
          price: 3,
          maxPersons: 2,
          isActive: 1,
          isToTakeHome: 1,
          imageUrl: "test",
          allergenes: "test",
          isVega: 1,
          isVegan: 0,
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be.a("string").that.equals("Name must be a string.");
          done();
        });
    });

    // niet ingelogd
    it("UC-301-2 Not logged in, return valid error", (done) => {
      chai
        .request(server)
        .post("/api/meal")
        .send({
          name: "test",
          description: "test",
          price: 3,
          maxPersons: 2,
          isActive: 1,
          isToTakeHome: 1,
          imageUrl: "test",
          allergenes: "test",
          isVega: 1,
          isVegan: 0,
        })
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

    // succesvol toegevoegd
    it("UC-301-3 Succesfull, return valid result", (done) => {
      dbconnection.query(user1, () => {
        chai
          .request(server)
          .post("/api/meal")
          .set({ Authorization: `Bearer ${token}` })
          .send({
            name: "Salade",
            description: "Mooie zomerse salade met veel groente",
            price: 3,
            maxAmountOfParticipants: 2,
            isActive: 1,
            isToTakeHome: 1,
            dateTime: "1000-01-01 00:00:00",
            imageUrl:
              "https://www.landleven.nl/getmedia/58639eae-3b6a-44db-b9ed-f417bb2859da/gemengde-salade-min.jpg?width=816&height=544&ext=.jpg",
            allergenes: "lactose",
            isVega: 1,
            isVegan: 0,
          })
          .end((err, res) => {
            res.should.be.an("object");
            let { status, message, result } = res.body;
            status.should.equals(201);
            message.should.be.a("string").that.equals("Meal added");
            result.should.be.an("object");
            done();
          });
      });
    });
  });

  describe("UC-302 Change meal", () => {
    beforeEach((done) => {
      done();
    });

    // verplichte velden missen
    it("UC-302-1 Missing name, return valid error", (done) => {
      chai
        .request(server)
        .put("/api/meal/1")
        .set({ Authorization: `Bearer ${token}` })
        .send({
          description: "test",
          price: 3,
          maxPersons: 2,
          isActive: 1,
          isToTakeHome: 1,
          imageUrl: "test",
          allergenes: "test",
          isVega: 1,
          isVegan: 0,
        })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(400);
          message.should.be.a("string").that.equals("Name must be a string.");
          done();
        });
    });

    // niet ingelogd
    it("UC-302-2 Not logged in, return valid error", (done) => {
      chai
        .request(server)
        .put("/api/meal/1")
        .send({
          name: "test",
          description: "test",
          price: 3,
          maxPersons: 2,
          isActive: 1,
          isToTakeHome: 1,
          imageUrl: "test",
          allergenes: "test",
          isVega: 1,
          isVegan: 0,
        })
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

    // niet eigenaar
    it("UC-302-3 Not the owner, return valid error", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(meal1, () => {
          chai
            .request(server)
            .put("/api/meal/15")
            .set({
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE2NTMwNTUyMTgsImV4cCI6MTY1NDA5MjAxOH0.dBTSy79OjVcBPhx7luvHecARUzNaCyASwXHxCVQio9A`,
            })
            .send({
              name: "test",
              description: "test",
              price: 3,
              maxPersons: 2,
              isActive: 1,
              isToTakeHome: 1,
              imageUrl: "test",
              allergenes: "test",
              isVega: 1,
              isVegan: 0,
            })
            .end((err, res) => {
              res.should.be.an("object");
              let { status, message } = res.body;
              status.should.equals(403);
              message.should.be
                .a("string")
                .that.equals(
                  "You can't edit this meal, because you are not the owner."
                );
              done();
            });
        });
      });
    });

    // maaltijd bestaat niet
    it("UC-302-4 Meal doesn't exist, return valid error", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(meal1, () => {
          chai
            .request(server)
            .put("/api/meal/99")
            .set({
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE2NTMwNTUyMTgsImV4cCI6MTY1NDA5MjAxOH0.dBTSy79OjVcBPhx7luvHecARUzNaCyASwXHxCVQio9A`,
            })
            .send({
              name: "test",
              description: "test",
              price: 3,
              maxPersons: 2,
              isActive: 1,
              isToTakeHome: 1,
              imageUrl: "test",
              allergenes: "test",
              isVega: 1,
              isVegan: 0,
            })
            .end((err, res) => {
              res.should.be.an("object");
              let { status, message } = res.body;
              status.should.equals(404);
              message.should.be
                .a("string")
                .that.equals("Meal with provided id does not exist");
              done();
            });
        });
      });
    });

    // maaltijd succesvol geupdate
    it("UC-302-5 Meal succesfull updated, return valid result", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(meal1, () => {
          chai
            .request(server)
            .put("/api/meal/15")
            .set({
              Authorization: `Bearer ${token}`,
            })
            .send({
              name: "Salade",
              description: "Mooie zomerse salade met veel groente",
              price: 3,
              maxAmountOfParticipants: 2,
              isActive: 1,
              isToTakeHome: 1,
              dateTime: "1000-01-01 00:00:00",
              imageUrl:
                "https://www.landleven.nl/getmedia/58639eae-3b6a-44db-b9ed-f417bb2859da/gemengde-salade-min.jpg?width=816&height=544&ext=.jpg",
              allergenes: "lactose",
              isVega: 1,
              isVegan: 0,
            })
            .end((err, res) => {
              res.should.be.an("object");
              let { status, message, result } = res.body;
              status.should.equals(200);
              message.should.be
                .a("string")
                .that.equals("Meal successfull changed");
              result.should.be.a("object");
              done();
            });
        });
      });
    });
  });

  describe("UC-303 Get list", () => {
    beforeEach((done) => {
      done();
    });

    // alle meals
    it("UC-303-1 Get all meals, return valid JSON", (done) => {
      chai
        .request(server)
        .get("/api/meal")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, result } = res.body;
          const amount = result.length;
          status.should.equals(200);
          result.should.be.a("array");
          amount.should.equals(0);
          done();
        });
    });
  });

  describe("UC-304 Details meal", () => {
    // maaltijd bestaat niet
    it("UC-304-1 Meal doesn't exists, return valid error", (done) => {
      chai
        .request(server)
        .get("/api/meal/15")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be
            .a("string")
            .that.equals("Meal with ID 15 not found");
          done();
        });
    });

    // maaltijd opgehaald
    it("UC-304-2 Meal returned, return valid result", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(meal1, () => {
          chai
            .request(server)
            .get("/api/meal/15")
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
              res.should.be.an("object");
              let { status, result } = res.body;
              status.should.equals(200);
              result.should.be.a("object");
              done();
            });
        });
      });
    });
  });

  describe("UC-304 Delete meal", () => {
    // niet ingelogd
    it("UC-305-2 Not logged in, return valid error", (done) => {
      chai
        .request(server)
        .delete("/api/meal/15")
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

    // niet eigenaar
    it("UC-305-3 Not owner, return valid error", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(meal1, () => {
          chai
            .request(server)
            .delete("/api/meal/15")
            .set({
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJpYXQiOjE2NTMwNTUyMTgsImV4cCI6MTY1NDA5MjAxOH0.dBTSy79OjVcBPhx7luvHecARUzNaCyASwXHxCVQio9A`,
            })
            .end((err, res) => {
              res.should.be.an("object");
              let { status, message } = res.body;
              status.should.equals(403);
              message.should.be
                .a("string")
                .that.equals(
                  "You can't delete this meal, because you are not the owner."
                );
              done();
            });
        });
      });
    });

    // maaltijd bestaat niet
    it("UC-305-4 Meal doesn't exists, return valid error", (done) => {
      chai
        .request(server)
        .delete("/api/meal/15")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          res.should.be.an("object");
          let { status, message } = res.body;
          status.should.equals(404);
          message.should.be
            .a("string")
            .that.equals("Meal with provided id does not exist");
          done();
        });
    });

    // delete meal
    it("UC-305-5 Meal succesfull deleted, return valid result", (done) => {
      dbconnection.query(user1, () => {
        dbconnection.query(meal1, () => {
          chai
            .request(server)
            .delete("/api/meal/15")
            .set({
              Authorization: `Bearer ${token}`,
            })
            .end((err, res) => {
              res.should.be.an("object");
              let { status, message } = res.body;
              status.should.equals(200);
              message.should.be
                .a("string")
                .that.equals("Meal successfull deleted");
              done();
            });
        });
      });
    });
  });
});
