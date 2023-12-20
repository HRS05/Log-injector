const express = require("express");
const app = express();
var http = require("http");
const server = http.createServer(app);
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const userAPI = require("./routes/user")();
const logAPI = require("./routes/log")();
const useClickhouse = require("./middleware/useClickhouse")

require("dotenv").config();

const dbConnection = require("./connection/db");
const { API_PORT } = process.env;

console.log("API_port ---> " + process.env.API_PORT);

let portNumber = process.env.API_PORT || 3000;
server.listen(portNumber, async function () {
  console.log("Server is running on " + portNumber);
  await dbConnection();
  app.use(bodyParser.json());
  app.use(useClickhouse);
  app.use("/api/user/", userAPI);
  app.use("/api/log/", logAPI);
});
