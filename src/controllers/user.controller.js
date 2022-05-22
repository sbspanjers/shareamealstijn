const assert = require("assert");
const dbconnection = require("../../database/dbconnection");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;

let controller = {
  validateUser: (req, res, next) => {
    const user = req.body;
    const { firstName, lastName, emailAdress, password } = user;
    try {
      const pattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;
      assert(typeof firstName === "string", "Firstname must be a string.");
      assert(typeof lastName === "string", "Lastname must be a string.");

      assert(pattern.test(emailAdress), "Emailadress is not valid");
      assert(typeof password === "string", "Password must be a string.");
      next();
    } catch (err) {
      const error = {
        status: 400,
        message: err.message,
      };
      next(error);
    }
  },
  validatePhoneNumber: (req, res, next) => {
    const { phoneNumber } = req.body;

    try {
      assert(typeof phoneNumber === "string", "Phonenumber is not valid");
      next();
    } catch (err) {
      const error = {
        status: 400,
        message: err.message,
      };
      next(error);
    }
  },
  addUser: (req, res, next) => {
    let user = req.body;
    let error;

    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      const queryString = `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, street, city) VALUES ('${user.firstName}', '${user.lastName}', 1, '${user.emailAdress}', '${hash}', '${user.street}', '${user.city}')`;

      dbconnection.query(queryString, (err, results, fields) => {
        if (results != null) {
          error = {
            status: 201,
            result: "User added",
            userId: results.insertId,
          };
        } else {
          error = {
            status: 409,
            message: "Email already in use.",
          };
        }
        next(error);
      });
    });
  },
  getAllUsers: (req, res, next) => {
    const params = req.query;
    const { active, firstName } = params;

    let users = [];
    let error;

    let queryString = "SELECT * FROM user";
    if (active || firstName) {
      queryString += " WHERE ";
      if (active) {
        queryString += `isActive = ${active}`;
      }
      if (active && firstName) {
        queryString += " AND ";
      }
      if (firstName) {
        queryString += `firstName LIKE '${firstName}%'`;
      }
    }
    queryString += ";";

    dbconnection.query(queryString, (err, results, fields) => {
      if (results != null) {
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
          message: "Something went wrong",
        };
      }

      next(error);
    });
  },
  getProfileFromUser: (req, res, next) => {
    let error;
    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];

    if (token) {
      const payload = jwt.decode(token);
      const userId = payload.userId;
      const queryString = `SELECT * FROM user WHERE id = ${userId}`;

      dbconnection.query(queryString, (err, results, fields) => {
        if (results != null) {
          const { ...user } = results[0];
          error = {
            status: 200,
            result: user,
          };
          next(error);
        } else {
          error = {
            status: 404,
            message: "User does not exist",
          };
          next(error);
        }
      });
    }
  },
  getUserById: (req, res, next) => {
    const params = req.params;
    const { userId } = params;
    let error;

    const queryString = `SELECT * FROM user WHERE id = ${userId};`;

    if (Number.isInteger(parseInt(userId))) {
      dbconnection.query(queryString, (err, results, fields) => {
        let user = results[0];
        if (user != null) {
          error = {
            status: 200,
            result: user,
          };
        } else {
          error = {
            status: 404,
            message: `User with ID ${userId} not found`,
          };
        }
        next(error);
      });
    } else {
      error = {
        status: 404,
        message: "Input was not a number",
      };
      next(error);
    }
  },
  updateUserById: (req, res, next) => {
    const user = req.body;
    const params = req.params;
    const { userId } = params;
    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];
    let error;

    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      const payload = jwt.decode(token);
      if (parseInt(userId) == payload.userId) {
        const queryString = `UPDATE user SET firstName = '${user.firstName}', lastName = '${user.lastName}', street = '${user.street}', city = '${user.city}', emailAdress = '${user.emailAdress}', password = '${hash}' WHERE id = ${userId}`;

        dbconnection.query(queryString, (err, results, fields) => {
          const { affectedRows, changedRows } = results;

          if (affectedRows != 0) {
            if (changedRows != 0) {
              error = {
                status: 200,
                message: "User successfull changed",
              };
            } else {
              error = {
                status: 401,
                message: "User not changed",
              };
            }
            next(error);
          } else {
            error = {
              status: 400,
              message: "User with provided id does not exist",
            };
          }

          next(error);
        });
      } else {
        error = {
          status: 403,
          message: "You can't change this account, because it is not yours",
        };
        next(error);
      }
    });
  },
  deleteUserById: (req, res, next) => {
    const userId = req.params.userId;
    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];
    let error;
    const payload = jwt.decode(token);

    if (parseInt(userId) == payload.userId) {
      const queryString = `DELETE FROM user WHERE id = ${userId}`;

      if (Number.isInteger(parseInt(userId))) {
        dbconnection.query(queryString, (err, results, fields) => {
          const { affectedRows } = results;
          if (affectedRows != 0) {
            error = {
              status: 200,
              message: "User successfull deleted",
            };
          } else {
            error = {
              status: 400,
              message: "User doesn't exist",
            };
          }

          next(error);
        });
      } else {
        error = {
          status: 404,
          message: "Input was not a number",
        };
        next(error);
      }
    } else {
      error = {
        status: 403,
        message: "You can't delete this account, because it is not yours",
      };
      next(error);
    }
  },
};

module.exports = controller;
