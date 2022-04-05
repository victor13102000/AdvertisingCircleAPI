const axios = require("axios");
const https = require("https");

axios.default.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function run(req, res, databaseConnection) {
  try {
    const body = req.body;

    const token = req.body.token;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const bodyParameters = {
      "Content-Type": "application/json",
    };
    const prueba = await axios.post(
      "https://accounts.clusterby.com/auth",
      bodyParameters,
      config
    );

    const advertiser = prueba.data.username;

    const name = body.name;
    const description = body.description;
    const startDate = body.startDate;
    const endDate = body.endDate;
    const type = body.type;
    const data = body.data;
    const imgUrl = body.img;

    // URL campaign
    if (type == 0) {
      const state = 1; // init state

      const campaign = {
        name: name,
        imgUrl: imgUrl,
        description: description,
        state: state,
        advertiser: advertiser,
        startDate: startDate,
        endDate: endDate,
        data: data,
      };

      const campaignsCollection = databaseConnection
        .db("adpolygon")
        .collection("campaigns");
      const previousCampaign = await campaignsCollection.findOne({
        name: body.name,
      });

      if (previousCampaign) {
        return res.status(400).json({
          success: false,
          message: "The user has already created a campaing with this name.",
        });
      }

      if (new Date(`<${startDate}>`) < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Start date has already passed.",
        });
      }

      if (new Date(`<${startDate}>`) > new Date(`<${endDate}>`)) {
        return res.status(400).json({
          success: false,
          message: "End date cannot be before Start date.",
        });
      }

      const resCampaign = await campaignsCollection.insertOne(campaign);

      res.status(200).json({
        success: true,
        message: "The campaign has been succesfully created.",
        ressultado: resCampaign,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateCampaigns(req, res, databaseConnection) {
  var ObjectId = require("mongodb").ObjectId;
  try {
    const token = req.body.token;

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const bodyParameters = {
      "Content-Type": "application/json",
    };
    const prueba = await axios.post(
      "https://accounts.clusterby.com/auth",
      bodyParameters,
      config
    );

    const user = prueba.data.username;

    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");
    const userInfo = await usersCollection.findOne({ username: user });

    const userType = userInfo.type;

    if (userType === "publisher") {
      return res.status(400).json({
        message: "User is not an advertiser",
        success: false,
      });
    }
    const _id = ObjectId(req.body.id);

    const {
      advertiser,
      name,
      description,
      startDate,
      endDate,
      state,
      type,
      data,
      imgUrl,
    } = req.body;

    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");

    const filter = {
      _id: _id,
    };

    const options = { upset: false };

    const updateDoc = {
      $set: {
        name: name != "" && name,
        imgUrl: imgUrl != "" && imgUrl,
        description: description != "" && description,
        startDate: startDate != "" && startDate,
        endDate: endDate != "" && endDate,
        data: data != "" && data,
      },
    };

    if (state === 1 && user === advertiser) {
      const result = await campaignsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(
        `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
      );
      res.status(200).json({
        message: "update data",
        success: true,
      });
    } else {
      res.status(400).json({
        message: "update not available",
        success: false,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  run: run,
  updateCampaigns: updateCampaigns,
};
