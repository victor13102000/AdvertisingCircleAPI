const axios = require("axios");
const https = require("https");

axios.default.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const ObjectId = require("mongodb").ObjectId;

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
        advertiser: advertiser,
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

      await campaignsCollection.insertOne(campaign);

      res.status(200).json({
        success: true,
        message: "The campaign has been succesfully created.",
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function deleteCampaign(req, res, databaseConnection) {
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

    const advertiser = prueba.data.username;
    const _id = req.body.id;

    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");
    const elimin = await campaignsCollection.deleteOne({
      _id: ObjectId(_id),
      advertiser: advertiser,
    });

    if (elimin.acknowledged) {
      res.status(200).json({
        message: "Campaign deleted",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function deleteAllCampaigns(req, res, databaseConnection) {
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

    const advertiser = prueba.data.username;

    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");
    const elimin = await campaignsCollection.deleteMany({
      advertiser: advertiser,
    });

    if (elimin.acknowledged) {
      res.status(200).json({
        message: `${elimin.deletedCount} Campaigns deleted`,
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateCampaigns(req, res, databaseConnection) {
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

async function advertiserCampaigns(req, res, databaseConnection) {
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

    const advertiser = prueba.data.username;

    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");
    const allCampaigns = await campaignsCollection.find({
      advertiser: advertiser,
    });

    const campañas = await allCampaigns.toArray();

    if (campañas[0]) {
      return res.status(200).json({
        success: true,
        message: "Campaigns Ok.",
        campaigns: campañas,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "Advertiser hasn´t uploaded any campaign yet.",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function advertiserSpecificCampaign(req, res, databaseConnection) {
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

    const advertiser = prueba.data.username;
    const _id = req.body.id;

    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");
    const campaign = await campaignsCollection.findOne({ _id: ObjectId(_id) });

    if (campaign && campaign.advertiser === advertiser) {
      return res.status(200).json({
        success: true,
        message: "Campaigns Ok.",
        campaigns: campaign,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "Something wen´t wrong, information not available.",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function allCampaigns(req, res, databaseConnection) {
  try {
    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");
    const allCampaigns = await campaignsCollection.find({});

    const campañas = await allCampaigns.toArray();

    if (campañas) {
      return res.status(200).json({
        success: true,
        message: "Campaigns Ok.",
        campaigns: campañas,
      });
    } else {
      return res.status(400).json({
        success: true,
        message: "No campaign has been uploaded yet.",
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  run: run,
  deleteCampaign: deleteCampaign,
  deleteAllCampaigns: deleteAllCampaigns,
  allCampaigns: allCampaigns,
  advertiserCampaigns: advertiserCampaigns,
  advertiserSpecificCampaign: advertiserSpecificCampaign,
  updateCampaigns: updateCampaigns,
};
