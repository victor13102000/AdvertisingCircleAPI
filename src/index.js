global.config = require("../config.json");

const database = require("./database.js");

const express = require("express");
const cors = require("cors");
const routes = require('./Routes')
  const app = express();
  
  (async () => {
    const databaseConnection = await database.getConnection(
      global.config.database.url
    );
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
})();