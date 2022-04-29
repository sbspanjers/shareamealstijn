const express = require("express");
const router = express.Router();
const mealController = require("../controllers/meal.controller");

// hello world message
router.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hellooo World!",
  });
});

// meal methodes
router.post("", (req, res) => {
  let meal = req.body;
  console.log(meal);
  mealId++;
  meal = {
    id: mealId,
    ...meal,
  };

  mealDatabase.push(meal);
  console.log(mealDatabase);
  res.status(201).json({
    status: 201,
    result: meal,
  });
});

router.get("", (req, res) => {
  res.status(200).json({
    status: 200,
    result: mealDatabase,
  });
});

router.get("/:mealId", (req, res) => {
  const mealId = req.params.mealId;
  let meal = mealDatabase.filter((item) => item.id == mealId);

  if (meal.length > 0) {
    console.log(meal);
    res.status(200).json({
      status: 200,
      result: meal,
    });
  } else {
    res.status(404).json({
      status: 404,
      result: `Meal with ID ${mealId} not found`,
    });
  }
});

module.exports = router;
