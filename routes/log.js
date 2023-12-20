const express = require("express");
const router = express.Router();
const logController = require("../controller/logController")();
const auth = require("../middleware/auth");
const accessAllowed = require("../middleware/accessAllowed");

const useClickhouse = require("../middleware/useClickhouse");

const projectAPI = () => {
  router.post("/logging", auth, accessAllowed(['admin']), logController.add);
  router.post("/getLogs", auth, accessAllowed(['admin']), logController.get);
  return router;
};

module.exports = projectAPI;
