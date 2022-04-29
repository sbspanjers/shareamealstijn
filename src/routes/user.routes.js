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

// user methodes
router.post("", userController.validateUser, userController.addUser);

router.get("r", userController.getAllUsers);

router.get("/profile/:userId", userController.getProfileFromUser);

router.get("/:userId", userController.getUserById);

router.put(
  "/:userId",
  userController.validateUser,
  userController.updateUserById
);

router.delete("/:userId", userController.deleteUserById);

module.exports = router;
