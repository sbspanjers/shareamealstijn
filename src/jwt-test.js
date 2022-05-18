const jwt = require("jsonwebtoken");

const privateKey = "secretstring";

jwt.sign(
  { userId: "41" },
  privateKey,
  { algorithm: "RS256" },
  function (err, token) {
    if (err) console.log(err);
    if (token) console.log(token);
  }
);
