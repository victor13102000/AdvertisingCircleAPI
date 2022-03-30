const express = require("express");
const routes = express.Router();
const user = require('./user')
const campaign = require("./campaign")

routes.use("/user", user);
routes.use("/campaign",campaign)

module.exports= routes