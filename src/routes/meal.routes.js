const express = require("express");
const router = express.Router();
const mealController = require("../controllers/meal.controller");
const authController = require("../controllers/auth.controller");

// meal methodes
router.post(
  "",
  authController.validateToken,
  mealController.validateMeal,
  mealController.addMeal
);

router.get("", mealController.getAllMeals);

router.get("/:mealId", mealController.getMealById);

router.put(
  "/:mealId",
  authController.validateToken,
  mealController.validateMeal,
  mealController.updateMealById
);

router.delete(
  "/:mealId",
  authController.validateToken,
  mealController.deleteMealById
);

module.exports = router;
