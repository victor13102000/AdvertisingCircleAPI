const express = require("express");
const { userInfo } = require("os");
const users = express.Router();
const createUser = require("../create/users");
const database = require("../database.js");
global.config = require("../../config.json");

(async () => {
  const databaseConnection = await database.getConnection(
    global.config.database.url
  );

  users.post("/create", (req, res) => {
    createUser.runUser(req, res, databaseConnection);
  });

  users.put("/update/type", (req, res) => {
    createUser.updateUserType(req, res, databaseConnection);
  });

  users.put("/update", (req, res) => {
    createUser.updateUser(req, res, databaseConnection);
  });

  users.post("/data", (req, res) => {
    createUser.dataUser(req, res, databaseConnection);
  });
  users.post("/userInfo", (req, res) => {
    createUser.userInfo(req, res, databaseConnection)
  })

})();

module.exports = users;
