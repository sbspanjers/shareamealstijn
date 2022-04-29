const assert = require("assert");
const dbconnection = require("../../database/dbconnection");

let userDatabase = [];
let userId = 0;

// TODO error handling by all
// Maybe joi from npm

let controller = {
  validateUser: (req, res, next) => {
    let user = req.body;
    let { firstName, lastName, street, city, emailAdress, password } = user;
    try {
      assert(typeof firstName === "string", "Firstname must be a string.");
      assert(typeof lastName === "string", "Lastname must be a string.");

      assert(typeof street === "string", "Street must be a string.");
      assert(typeof city === "string", "City must be a string.");

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
    const result = userDatabase.filter(
      (item) => item.emailAdress == user.emailAdress
    );
    if (!result.length) {
      userId++;
      user = {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        street: user.street,
        city: user.city,
        emailAdress: user.emailAdress,
        password: user.password,
      };
      userDatabase.push(user);
      res.status(200).json({
        status: 200,
        result: user,
      });
      console.log(user);
    } else {
      res.status(404).json({
        status: 404,
        result: "Email already in use.",
      });
    }
  },
  getAllUsers: (req, res, next) => {
    let users = [];
    dbconnection.query("SELECT * FROM user", (error, results, fields) => {
      console.log("#results: " + results.length);

      results.forEach((user) => {
        users.push(user);
      });
      res.status(200).json({
        status: 200,
        result: users,
      });
    });
  },
  getProfileFromUser: (req, res, next) => {
    res.status(400).json({
      status: 404,
      result: "Not implemented yet",
    });
  },
  getUserById: (req, res, next) => {
    const userId = req.params.userId;

    dbconnection.query(
      `SELECT * FROM user WHERE id = ${userId}`,
      (error, results, fields) => {
        console.log("#results:" + results.length);
        let user = results[0];
        if (results.length > 0) {
          console.log(user);
          res.status(200).json({
            status: 200,
            result: user,
          });
        } else {
          const error = {
            status: 404,
            result: `User with ID ${userId} not found`,
          };
          next(error);
        }
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
        console.log(results);

        if (results != null) {
          error = {
            status: 200,
            message: "User successfull changed",
          };
        } else {
          error = {
            status: 404,
            message: "User with provided id does not exist",
          };
        }

        next(error);
      }
    );

    // if (result > -1) {
    //   let user = req.body;
    //   userDatabase[result] = {
    //     id: userId,
    //     firstName: user.firstName,
    //     lastName: user.lastName,
    //     street: user.street,
    //     city: user.city,
    //     emailAdress: user.emailAdress,
    //     password: user.password,
    //   };
    //   error = {
    //     status: 200,
    //     message: userDatabase[result],
    //   };
    // } else {
    //   error = {
    //     status: 404,
    //     message: "User with provided id does not exist",
    //   };
    // }
    // next(error);
  },
  deleteUserById: (req, res, next) => {
    const userId = req.params.userId;
    console.log(userId);
    let userIndex = userDatabase.findIndex((obj) => obj.id == userId);

    if (userIndex > -1) {
      userDatabase.splice(userIndex, 1);

      res.status(200).json({
        status: 200,
        result: "User has been deleted",
      });
    } else {
      res.status(400).json({
        status: 405,
        result: "User has not been deleted",
      });
    }
  },
};

module.exports = controller;
