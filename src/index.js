global.config = require("../config.json");

const database = require("./database.js");

const express = require("express");
const cors = require("cors");
const routes = require('./Routes')
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );
  app.use('/', routes)
  app.listen(global.config.port, () =>
    console.log("SERVER UP | Port: " + global.config.port)
  );
