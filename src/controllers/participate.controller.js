const dbconnection = require("../../database/dbconnection");
const jwt = require("jsonwebtoken");

let controller = {
  joinMeal: (req, res, next) => {
    const mealId = req.params.mealId;

    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];
    const payload = jwt.decode(token);

    let error;
    const queryString = `INSERT INTO meal_participants_user (mealId, userId) VALUES (${mealId}, ${payload.userId})`;

    dbconnection.query(queryString, (err, results, fields) => {
      if (results != null) {
        let meal;
        dbconnection.query(
          `SELECT * FROM meal WHERE id = ${mealId}`,
          (mealErr, mealResults, mealFields) => {
            meal = mealResults[0];
            error = {
              status: 200,
              result: meal,
              message: "You joined the meal.",
            };
            next(error);
          }
        );
      } else {
        error = {
          status: 404,
          message: "Meal doesn't exist",
        };
        next(error);
      }
    });
  },
  leaveMeal: (req, res, next) => {
    const mealId = req.params.mealId;

    const tokenString = req.headers.authorization.split(" ");
    const token = tokenString[1];
    const payload = jwt.decode(token);

    let error;
    const queryString = `DELETE FROM meal_participants_user WHERE mealId = ${mealId} AND userId = ${payload.userId}`;

    dbconnection.query(queryString, (err, results, fields) => {
      const { affectedRows, changedRows } = results;
      console.log(results);
      if (affectedRows != 0) {
        if (changedRows != 0) {
          error = {
            status: 200,
            message: `You left the meal with id ${mealId}.`,
          };
        } else {
          error = {
            status: 404,
            message: "Meal doesn't exist.",
          };
        }
      } else {
        error = {
          status: 404,
          message: "Meal doesn't exist.",
        };
      }
      next(error);
    });
  },
};

module.exports = controller;
