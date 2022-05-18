const assert = require("assert");
const dbconnection = require("../../database/dbconnection");
const jwt = require("jsonwebtoken");

const checkUserIdQuery = "SELECT cookId FROM meal WHERE id = ?";

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

    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];
    const payload = jwt.decode(token);

    dbconnection.query(
      `INSERT INTO meal (name, description, price, maxAmountOfParticipants, isActive, isVega, isVegan, isToTakeHome, imageUrl, cookId, allergenes) VALUES ('${meal.name}', '${meal.description}', ${meal.price}, ${meal.maxPersons}, ${meal.isActive}, ${meal.isVega}, ${meal.isVegan}, ${meal.isToTakeHome}, '${meal.imageUrl}', ${payload.userId}, '${meal.allergenes}')`,
      (err, results, fields) => {
        if (results != null) {
          error = {
            status: 200,
            message: "Meal added",
          };
        } else {
          error = {
            status: 404,
            message: "Meal not added",
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
          message: "Something went wrong",
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
            message: `Meal with ID ${mealId} not found`,
          };
          console.log(err);
        }

        next(error);
      }
    );
  },
  updateMealById: (req, res, next) => {
    const meal = req.body;
    const params = req.params;
    const { mealId } = params;
    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];
    const payload = jwt.decode(token);
    let error;

    dbconnection.query(checkUserIdQuery, [mealId], (err, results, fields) => {
      if (payload.userId == results[0].cookId) {
        const queryString = `UPDATE meal SET isActive = ${meal.isActive}, isVega = ${meal.isVega}, isVegan = ${meal.isVegan}, isToTakeHome = ${meal.isToTakeHome}, maxAmountOfParticipants = ${meal.maxPersons}, price = ${meal.price}, imageUrl = '${meal.imageUrl}', cookId = ${meal.cookId}, name = '${meal.name}', description = '${meal.description}', allergenes = '${meal.allergenes}' WHERE id = ${mealId}`;
        dbconnection.query(queryString, (err, results, fields) => {
          if (err) throw err;
          const { affectedRows, changedRows } = results;
          console.log(results);

          if (affectedRows != 0) {
            if (changedRows != 0) {
              error = {
                status: 200,
                message: "Meal successfull changed",
              };
            } else {
              error = {
                status: 404,
                message: "Meal not changed",
              };
            }
          } else {
            error = {
              status: 404,
              message: "User with provided id does not exist",
            };
          }

          next(error);
        });
      } else {
        error = {
          status: 403,
          message: "You can't edit this meal, because you are not the owner.",
        };
        next(error);
      }
    });
  },
  deleteMealById: (req, res, next) => {
    const mealId = req.params.mealId;
    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];
    const payload = jwt.decode(token);
    let error;

    dbconnection.query(checkUserIdQuery, [mealId], (err, results, fields) => {
      if (payload.userId == results[0].cookId) {
        const queryString = `DELETE FROM meal WHERE id = ${mealId}`;

        dbconnection.query(queryString, (err, results, fields) => {
          const { affectedRows } = results;
          if (affectedRows != 0) {
            error = {
              status: 200,
              message: "Meal successfull deleted",
            };
          } else {
            error = {
              status: 404,
              message: "Meal has not been deleted",
            };
            console.log(err);
          }

          next(error);
        });
      } else {
        error = {
          status: 403,
          message: "You can't delete this meal, because you are not the owner.",
        };
        next(error);
      }
    });
  },
};

module.exports = controller;
