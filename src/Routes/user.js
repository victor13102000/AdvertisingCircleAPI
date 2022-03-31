const express = require("express");
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

  users.put("/update", (req, res) => {
    createUser.updateUser(req, res, databaseConnection);
  });

  users.get("/data", (req, res) => {
    createUser.dataUser(req, res, databaseConnection);
  });

})();

module.exports = users;
