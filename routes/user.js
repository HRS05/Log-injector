const express = require("express");
const router = express.Router();
const userController = require("../controller/userController")();
const auth = require("../middleware/auth");

const userAPI = () => {
  router.post("/registerUser", userController.registerUser);
  router.post("/loginUser", userController.loginUser);

  return router;
};

module.exports = userAPI;
