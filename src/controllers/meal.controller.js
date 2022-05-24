const assert = require("assert");
const dbconnection = require("../../database/dbconnection");
const jwt = require("jsonwebtoken");

const checkUserIdQuery = "SELECT cookId FROM meal WHERE id = ?";

let controller = {
  validateMeal: (req, res, next) => {
    let meal = req.body;
    let {
      name,
      description,
      price,
      maxAmountOfParticipants,
      isActive,
      isToTakeHome,
      imageUrl,
      allergenes,
      isVega,
      isVegan,
    } = meal;
    try {
      assert(typeof name === "string", "Name must be a string.");
      assert(typeof description === "string", "Description must be a string.");
      assert(typeof price === "number", "Price must be a integer.");
      assert(
        typeof maxAmountOfParticipants === "number",
        "Max persons must be a integer."
      );
      assert(typeof isActive === "number", "Active must be a number.");
      assert(
        typeof isToTakeHome === "number",
        "To take home must be a integer."
      );
      assert(typeof imageUrl === "string", "URL must be a string.");
      assert(typeof allergenes === "string", "Allergenes must be a string.");
      assert(typeof isVega === "number", "Vega must be a integer.");
      assert(typeof isVegan === "number", "Vegan must be a integer.");
      next();
    } catch (err) {
      const error = {
        status: 400,
        message: err.message,
      };
      console.log(err.message);
      next(error);
    }
  },
  addMeal: (req, res, next) => {
    let meal = req.body;
    let error;

    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];
    const payload = jwt.decode(token);
    meal.cookId = payload.userId;
    dbconnection.query(
      `INSERT INTO meal SET ?`,
      meal,
      (err, results, fields) => {
        console.log(err || results);
        if (results != null) {
          const { affectedRows } = results;
          if (affectedRows > 0) {
            error = {
              status: 201,
              message: "Meal added",
              result: { id: results.insertId, ...meal },
            };
          } else {
            error = {
              status: 404,
              message: "Meal not added",
            };
          }
          next(error);
        } else {
          error = {
            status: 404,
            message: "Meal not added",
            err: err,
          };
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
      }

      next(error);
    });
  },
  getMealById: (req, res, next) => {
    const mealId = req.params.mealId;
    let error;

    dbconnection.query(
      `SELECT * FROM meal WHERE id = ${mealId}`,
      (err, results, fields) => {
        if (results.length > 0) {
          const meal = results[0];

          error = {
            status: 200,
            result: meal,
          };
        } else {
          error = {
            status: 404,
            message: `Meal with ID ${mealId} not found`,
          };
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

    dbconnection.query(checkUserIdQuery, [mealId], (err, result, fields) => {
      if (result.length > 0 && result != null) {
        if (payload.userId == result[0].cookId) {
          const queryString = `UPDATE meal SET isActive = ${meal.isActive}, isVega = ${meal.isVega}, isVegan = ${meal.isVegan}, isToTakeHome = ${meal.isToTakeHome},maxAmountOfParticipants = ${meal.maxAmountOfParticipants}, price = ${meal.price}, imageUrl = '${meal.imageUrl}', cookId = ${payload.userId}, name = '${meal.name}', description = '${meal.description}', allergenes = '${meal.allergenes}', dateTime = '${meal.dateTime}' WHERE id = ${mealId}`;
          dbconnection.query(queryString, (err, results, fields) => {
            const { affectedRows, changedRows } = results;

            if (affectedRows != 0) {
              if (changedRows != 0) {
                error = {
                  status: 200,
                  message: "Meal successfull changed",
                  result: meal,
                };
              } else {
                error = {
                  status: 404,
                  message: "Meal not changed",
                };
              }
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
      } else {
        error = {
          status: 404,
          message: "Meal with provided id does not exist",
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

    dbconnection.query(checkUserIdQuery, [mealId], (err, result, fields) => {
      if (result.length > 0) {
        if (payload.userId == result[0].cookId) {
          const queryString = `DELETE FROM meal WHERE id = ${mealId}`;

          dbconnection.query(queryString, (err, results, fields) => {
            const { affectedRows } = results;
            if (affectedRows > 0) {
              error = {
                status: 200,
                message: `Meal with id ${mealId} successfull deleted`,
              };
            } else {
              error = {
                status: 404,
                message: "Meal has not been deleted",
              };
            }

            next(error);
          });
        } else {
          error = {
            status: 403,
            message:
              "You can't delete this meal, because you are not the owner.",
          };
          next(error);
        }
      } else {
        error = {
          status: 404,
          message: "Meal with provided id does not exist",
        };
        next(error);
      }
    });
  },
};

module.exports = controller;
