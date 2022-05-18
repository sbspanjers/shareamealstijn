const express = require("express");
const router = express.Router();
const mealController = require("../controllers/meal.controller");

// meal methodes
router.post("", mealController.validateMeal, mealController.addMeal);

router.get("", mealController.getAllMeals);

router.get("/:mealId", mealController.getMealById);

router.put("/:mealId", mealController.updateMealById);

module.exports = router;
