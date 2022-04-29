require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/user.routes");
const mealRouter = require("./src/routes/meal.routes");
const port = process.env.PORT;

app.use(bodyParser.json());

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Methode ${method} aangeroepen`);
  next();
});

app.use("/api/user", userRouter);
app.use("/api/meal", mealRouter);

app.all("*", (req, res) => {
  res.status(400).json({
    status: 404,
    result: "End-point not found",
  });
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
