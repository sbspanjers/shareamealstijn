require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./src/routes/user.routes");
const authRouter = require("./src/routes/auth.routes");
const mealRouter = require("./src/routes/meal.routes");
const participateRouter = require("./src/routes/participate.routes");
const port = process.env.PORT;

app.use(bodyParser.json());

app.all("*", (req, res, next) => {
  const method = req.method;
  console.log(`Method ${method} is aangeroepen op URL:${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hello World",
  });
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/meal", mealRouter);
app.use("/api/participate", participateRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: 404,
    result: "End-point not found",
  });
});

//Error handler
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
