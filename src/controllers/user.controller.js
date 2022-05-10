const assert = require("assert");
const dbconnection = require("../../database/dbconnection");

// Maybe joi from npm

let controller = {
  validateUser: (req, res, next) => {
    let user = req.body;
    let { firstName, lastName, street, city, emailAdress, password } = user;
    try {
      assert(typeof firstName === "string", "Firstname must be a string.");
      assert(typeof lastName === "string", "Lastname must be a string.");

      assert(typeof emailAdress === "string", "Email must be a string.");
      assert(typeof password === "string", "Password must be a string.");
      next();
    } catch (err) {
      const error = {
        status: 400,
        result: err.message,
      };
      next(error);
    }
  },
  addUser: (req, res, next) => {
    let user = req.body;
    let error;

    dbconnection.query(
      `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, street, city) VALUES ('${user.firstName}', '${user.lastName}', 1, '${user.emailAdress}', '${user.password}', '${user.street}', '${user.city}')`,
      (err, results, fields) => {
        if (results != null) {
          error = {
            status: 200,
            result: "User added",
            userId: results.insertId,
          };
          console.log(results);
        } else {
          error = {
            status: 404,
            result: "Email already in use.",
          };
          console.log(err);
        }
        next(error);
      }
    );
  },
  getAllUsers: (req, res, next) => {
    let users = [];
    let error;

    dbconnection.query("SELECT * FROM user", (err, results, fields) => {
      if (results != null) {
        console.log("#results: " + results.length);
        results.forEach((user) => {
          users.push(user);
        });

        error = {
          status: 200,
          result: users,
        };
      } else {
        error = {
          status: 404,
          result: "Something went wrong",
        };
        console.log(err);
      }

      next(error);
    });
  },
  getProfileFromUser: (req, res, next) => {
    const error = {
      status: 404,
      result: "Not implemented yet",
    };
    next(error);
  },
  getUserById: (req, res, next) => {
    const userId = req.params.userId;
    let error;

    dbconnection.query(
      `SELECT * FROM user WHERE id = ${userId}`,
      (err, results, fields) => {
        let user = results[0];
        if (user != null) {
          console.log("#results:" + results.length);
          console.log(user);
          error = {
            status: 200,
            result: user,
          };
        } else {
          error = {
            status: 404,
            result: `User with ID ${userId} not found`,
          };
          console.log(err);
        }
        next(error);
      }
    );
  },
  updateUserById: (req, res, next) => {
    let user = req.body;
    let userId = req.params.userId;
    let error;

    dbconnection.query(
      `UPDATE user SET firstName = '${user.firstName}', lastName = '${user.lastName}', street = '${user.street}', city = '${user.city}', emailAdress = '${user.emailAdress}', password = '${user.password}' WHERE id = ${userId}`,
      (err, results, fields) => {
        if (err) throw err;
        let { changedRows } = results;
        console.log(results);

        if (changedRows != 0) {
          error = {
            status: 200,
            result: "User successfull changed",
          };
        } else {
          error = {
            status: 404,
            result: "User with provided id does not exist",
          };
        }

        next(error);
      }
    );
  },
  deleteUserById: (req, res, next) => {
    const userId = req.params.userId;
    let error;
    console.log(userId);

    dbconnection.query(
      `DELETE FROM user WHERE id = ${userId}`,
      (err, results, fields) => {
        console.log(results);

        let { affectedRows } = results;
        if (affectedRows != 0) {
          error = {
            status: 200,
            result: "User successfull deleted",
          };
        } else {
          error = {
            status: 404,
            result: "User has not been deleted",
          };
          console.log(err);
        }

        next(error);
      }
    );
  },
};

module.exports = controller;
