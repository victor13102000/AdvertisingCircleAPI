global.config = require("../config.json");

const database = require("./database.js");

const express = require("express");
const cors = require("cors");

const createCampaign = require("./create/campaign");
const res = require("express/lib/response");
const createUser = require("./create/users");

(async () => {
  const databaseConnection = await database.getConnection(
    global.config.database.url
  );

  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: "*",
    })
  );

  app.post("/create/campaign", (req, res) => {
    createCampaign.run(req, res, databaseConnection);
  });
  app.post("/create/user", (req, res) => {
    createUser.runUser(req, res, databaseConnection);
  });

  app.listen(global.config.port, () =>
    console.log("SERVER UP | Port: " + global.config.port)
  );
})();
