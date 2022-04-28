const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// hello world message
router.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    result: "Hellooo World!",
  });
});

// meal methodes
router.post("/api/meal", (req, res) => {
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

router.get("/api/meal", (req, res) => {
  res.status(200).json({
    status: 200,
    result: mealDatabase,
  });
});

router.get("/api/meal/:mealId", (req, res) => {
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

// user methodes
router.post("/api/user", userController.validateUser, userController.addUser);

router.get("/api/user", userController.getAllUsers);

router.get("/api/user/profile/:userId", userController.getProfileFromUser);

router.get("/api/user/:userId", userController.getUserById);

router.put(
  "/api/user/:userId",
  userController.validateUser,
  userController.updateUserById
);

router.delete("/api/user/:userId", userController.deleteUserById);

module.exports = router;
