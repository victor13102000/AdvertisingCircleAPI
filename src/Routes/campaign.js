const express = require("express");
const campaign = express.Router();
const createCampaign = require("../create/campaign");
const database = require("../database.js");
global.config = require("../../config.json");

(async () => {
  const databaseConnection = await database.getConnection(
    global.config.database.url
  );

  campaign.post("/create", (req, res) => {
    createCampaign.run(req, res, databaseConnection);
  });

  campaign.put("/update", (req, res) => {
    createCampaign.updateCampaigns(req, res, databaseConnection);
  });
})();
module.exports = campaign;
