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

  campaign.post("/deleteCampaign", (req, res) => {
    createCampaign.deleteCampaign(req, res, databaseConnection);
  });

  campaign.delete("/deleteAllCampaigns", (req, res) => {
    createCampaign.deleteAllCampaigns(req, res, databaseConnection);
  });

  campaign.put("/update", (req, res) => {
    createCampaign.updateCampaigns(req, res, databaseConnection);
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

  campaign.put("/cancelCampaing", (req, res) => {
    createCampaign.cancelCampaing(req, res, databaseConnection);
  });

  campaign.post("/filterCampagns", (req, res) => {
    createCampaign.filterCampaigns(req, res, databaseConnection);
  });

  campaign.post("/addtofavorite", (req, res) => {
    createCampaign.favoriteCampaigns(req, res, databaseConnection);
  });
  campaign.post("/listtofavorite", (req, res) => {
    createCampaign.favoriteCampaignsList(req, res, databaseConnection);
  });
  campaign.post("/publisherSpecificSearch", (req, res) => {
    createCampaign.publisherSpecificSearch(req, res, databaseConnection);
  })
})();
module.exports = campaign;
