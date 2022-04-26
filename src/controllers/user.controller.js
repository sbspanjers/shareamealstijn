const assert = require("assert");

let mealDatabase = [];
let mealId = 0;

let userDatabase = [];
let userId = 0;

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
    } catch (error) {
      console.log(console.error());
      res.status(400).json({
        status: 400,
        result: error.toString(),
      });
    }
  },

  addUser: (req, res) => {
    let user = req.body;
    if (userDatabase.filter((item) => item.email == user.email)) {
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
      console.log(userDatabase);
      res.status(200).json({
        status: 200,
        result: user,
      });
    } else {
      res.status(404).json({
        status: 404,
        result: "Email already in use",
      });
    }
  },
  getAllUsers: (req, res) => {
    res.status(200).json({
      status: 200,
      result: userDatabase,
    });
  },
  getProfileFromUser: (req, res) => {
    res.status(400).json({
      status: 404,
      result: "Not implemented yet",
    });
  },
  getUserById: (req, res) => {
    const userId = req.params.userId;
    let user = userDatabase.filter((item) => item.id == userId);

    if (user.length > 0) {
      console.log(user);
      res.status(200).json({
        status: 201,
        result: user,
      });
    } else {
      res.status(404).json({
        status: 404,
        result: `Meal with ID ${userId} not found`,
      });
    }
  },
  updateUserById: (req, res) => {
    let user = req.body;
    let userIndex = userDatabase.findIndex((obj) => obj.id == userId);
    userDatabase[userIndex] = {
      user: {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        street: user.street,
        city: user.city,
        emailAdress: user.emailAdress,
        password: user.password,
      },
    };

    console.log(userDatabase);
    res.status(200).json({
      status: 200,
      result: user,
    });
  },
  deleteUserById: (req, res) => {
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
