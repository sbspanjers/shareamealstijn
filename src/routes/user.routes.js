const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

router.post("/", userController.validateUser, userController.addUser);

router.get("/", authController.validateToken, userController.getAllUsers);

router.get(
  "/profile",
  authController.validateToken,
  userController.getProfileFromUser
);

router.get(
  "/:userId",
  authController.validateToken,
  userController.getUserById
);

router.put(
  "/:userId",
  authController.validateToken,
  userController.validateUser,
  userController.validatePhoneNumber,
  userController.updateUserById
);

router.delete(
  "/:userId",
  authController.validateToken,
  userController.deleteUserById
);

module.exports = router;
