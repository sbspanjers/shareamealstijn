const express = require("express");
const router = express.Router();
const partController = require("../controllers/participate.controller");
const authController = require("../controllers/auth.controller");

router.post("/:mealId", authController.validateToken, partController.joinMeal);

router.delete(
  "/:mealId",
  authController.validateToken,
  partController.leaveMeal
);

module.exports = router;
