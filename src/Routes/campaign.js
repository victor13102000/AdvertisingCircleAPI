const express = require("express"); 
const campaign = express.Router() 
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

campaign.post("/advertiserCampaigns", (req, res) => {
  createCampaign.advertiserCampaigns(req, res, databaseConnection);
});

campaign.post("/specific", (req, res) => {
  createCampaign.advertiserSpecificCampaign(req, res, databaseConnection);
});

campaign.get("/allCampaigns", (req, res) => {
  createCampaign.allCampaigns(req, res, databaseConnection);
});

})();
module.exports= campaign