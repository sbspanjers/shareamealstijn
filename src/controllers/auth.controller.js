const assert = require("assert");
const pool = require("../../database/dbconnection");
const jwt = require("jsonwebtoken");
const jwtSecretKey = require("../config/config").jwtSecretKey;
const bcrypt = require("bcrypt");

let controller = {
  login(req, res, next) {
    //Look if user exists
    const queryString = `SELECT id, firstName, lastName, password FROM user WHERE emailAdress = '${req.body.emailAdress}'`;

    pool.query(queryString, (err, rows, fields) => {
      if (err) {
        res.status(400).json({
          status: 400,
          message: err.toString(),
        });
      }
      if (rows != 0) {
        //If user does exist
        bcrypt.compare(
          req.body.password,
          rows[0].password,
          function (err, result) {
            if (rows && rows.length === 1 && result) {
              // Extract the password from the userdata - we do not send that in the response.
              const { password, ...userinfo } = rows[0];
              // Create an object containing the data we want in the payload.
              const payload = {
                userId: userinfo.id,
              };

              jwt.sign(
                payload,
                jwtSecretKey,
                { expiresIn: "12d" },
                function (err, token) {
                  res.status(200).json({
                    status: 200,
                    results: { ...userinfo, token },
                  });
                }
              );
            } else {
              res.status(404).json({
                status: 404,
                message: "Password invalid",
              });
            }
          }
        );
      } else {
        res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }
    });
  },
  validateLogin(req, res, next) {
    // Verify that we receive the expected input
    const pattern = /[a-z0-9]+@[a-z]+\.[a-z]{2,4}/;

    try {
      assert(pattern.test(req.body.emailAdress), "Emailadress is not valid");
      assert(
        typeof req.body.password === "string",
        "password must be a string."
      );
      next();
    } catch (exception) {
      res.status(400).json({
        status: 400,
        message: exception.message,
      });
    }
  },
  validateToken(req, res, next) {
    // The headers should contain the authorization-field with value 'Bearer [token]'
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({
        status: 401,
        message: "Authorization header missing!",
      });
    } else {
      // Strip the word 'Bearer ' from the headervalue
      const token = authHeader.substring(7, authHeader.length);

      jwt.verify(token, jwtSecretKey, (err, payload) => {
        if (err) {
          res.status(401).json({
            status: 401,
            message: "Not authorized",
          });
        }
        if (payload) {
          // User heeft toegang. Voeg UserId uit payload toe aan
          // request, voor ieder volgend endpoint.
          req.userId = payload.userId;
          next();
        }
      });
    }
  },
};

module.exports = controller;
