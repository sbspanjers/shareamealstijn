const assert = require("assert");
const dbconnection = require("../../database/dbconnection");

// Maybe joi from npm

let controller = {
  validateMeal: (req, res, next) => {
    let user = req.body;
    let { name, description, price } = user;
    try {
      assert(typeof name === "string", "Name must be a string.");
      assert(typeof description === "string", "Description must be a string.");
      assert(typeof price === "number", "Price must be a integer.");
      next();
    } catch (err) {
      const error = {
        status: 404,
        result: err.message,
      };
      console.log(typeof price);
      next(error);
    }
  },
  addMeal: (req, res, next) => {
    let meal = req.body;
    let error;

    dbconnection.query(
      `INSERT INTO meal (name, description, price, maxAmountOfParticipants) VALUES ('${meal.name}', '${meal.description}', ${meal.price}, ${meal.maxPersons})`,
      (err, results, fields) => {
        if (results != null) {
          error = {
            status: 200,
            result: "Meal added",
          };
        } else {
          error = {
            status: 404,
            result: "Meal not added",
          };
          console.log(err);
        }
        next(error);
      }
    );
  },
  getAllMeals: (req, res, next) => {
    let meals = [];
    let error;

    dbconnection.query(`SELECT * FROM meal`, (err, results, fields) => {
      if (results != null) {
        console.log("#results: " + results.length);
        results.forEach((meal) => {
          meals.push(meal);
        });

        error = {
          status: 200,
          result: meals,
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
  getMealById: (req, res, next) => {
    console.log("test");
    const mealId = req.params.mealId;
    let error;

    dbconnection.query(
      `SELECT * FROM meal WHERE id = ${mealId}`,
      (err, results, fields) => {
        if (results != null) {
          const meal = results[0];
          console.log(meal);

          error = {
            status: 200,
            result: meal,
          };
        } else {
          error = {
            status: 404,
            result: `Meal with ID ${mealId} not found`,
          };
          console.log(err);
        }

        next(error);
      }
    );
  },
};

module.exports = controller;
