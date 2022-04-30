const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("", userController.validateUser, userController.addUser);

router.get("", userController.getAllUsers);

router.get("/profile/:userId", userController.getProfileFromUser);

router.get("/:userId", userController.getUserById);

router.put(
  "/:userId",
  userController.validateUser,
  userController.updateUserById
);

router.delete("/:userId", userController.deleteUserById);

module.exports = router;
