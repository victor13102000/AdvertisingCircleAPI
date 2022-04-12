const axios = require("axios");
const https = require("https");

axios.default.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const ObjectId = require("mongodb").ObjectId;

async function run(req, res, databaseConnection) {
  try {
    const body = req.body.data;

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

    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");
    const userInfo = await usersCollection.findOne({ username: advertiser });

    const userType = userInfo.type;

    if (userType === "publisher") {
      return res.status(400).json({
        message: "User is not an advertiser",
        success: false,
      });
    }

    const name = body.name;
    const description = body.description;
    const startDate = body.startDate;
    const endDate = body.endDate;
    const type = body.type;
    const objetives = {
      impresionesDeseadas: body.impresionesDeseadas,
      URL_objetivo: body.URL_objetivo,
    };
    const rules = {
      ageMin: parseInt(body.ageMin),
      ageMax: parseInt(body.ageMax),
      gender: body.gender,
      language: body.language,
      speech: body.speech,
    };
    const imgUrl = body.img;

    // URL campaign
    if (type == "URL") {
      const state = "Created"; // init state

      const campaign = {
        name: name,
        imgUrl: imgUrl,
        description: description,
        state: state,
        advertiser: advertiser,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rules: rules,
        objectives: objetives,
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

      /* if (new Date(`<${startDate}>`) < new Date()) {
        return res.status(400).json({
          success: false,
          message: "Start date has already passed.",
        });
      } */

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

    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");
    const userInfo = await usersCollection.findOne({ username: advertiser });

    const userType = userInfo.type;

    if (userType === "publisher") {
      return res.status(400).json({
        message: "User is not an advertiser",
        success: false,
      });
    }

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

    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");
    const userInfo = await usersCollection.findOne({ username: advertiser });

    const userType = userInfo.type;

    if (userType === "publisher") {
      return res.status(400).json({
        message: "User is not an advertiser",
        success: false,
      });
    }

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
    console.log(req.body);
    const body = req.body.data;

    const name = body.name;
    const description = body.description;
    const startDate = new Date(body.startDate);
    const endDate = new Date(body.endDate);
    const type = body.type;
    const objectives = {
      impresionesDeseadas: body.impresionesDeseadas,
      URL_objetivo: body.URL_objetivo,
    };
    const rules = {
      ageMin: body.ageMin,
      ageMax: body.ageMax,
      gender: body.gender,
      language: body.language,
      speech: body.speech,
    };
    const imgUrl = body.imgUrl;
    const state = body.state || "Created";

    console.log(name);

    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");

    const filter = {
      _id: _id,
    };

    const options = { upset: false };

    const updateDoc = {
      $set: {
        name: name,
        imgUrl: imgUrl != "" && imgUrl,
        description: description != "" && description,
        startDate: startDate != "" && startDate,
        endDate: endDate != "" && endDate,
        objectives: objectives != "" && objectives,
        rules: rules != "" && rules,
      },
    };

    if (state === "Created") {
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

    date = new Date();

    const filterOne = {
      startDate: { $lte: date },
      endDate: { $gte: date },
      state: { $ne: "Finished" },
    };
    const setStateOne = {
      $set: {
        state: "In Progress",
      },
    };

    const resultOne = await campaignsCollection.updateMany(
      filterOne,
      setStateOne
    );

    const filterTwo = { endDate: { $lt: date } };
    const setStateTwo = {
      $set: {
        state: "Finished",
      },
    };
    const resultTwo = await campaignsCollection.updateMany(
      filterTwo,
      setStateTwo
    );

    const allCampaigns = await campaignsCollection.find({
      advertiser: advertiser,
    });

    const campañas = await allCampaigns.toArray();

    if (campañas[0]) {

      campañas.forEach(campaña => {
      let fechaInicio = campaña.startDate.toISOString()
      let fechaFinal = campaña.endDate.toISOString()

      fechaInicio = fechaInicio.replace(/-/g, '\/').replace(/T.+/, '');
      fechaFinal = fechaFinal.replace(/-/g, '\/').replace(/T.+/, '');

      campaña.startDate = fechaInicio
      campaña.endDate = fechaFinal
      });


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

    date = new Date();
    console.log(date);

    const filterOne = {
      startDate: { $lte: date },
      endDate: { $gte: date },
      state: { $ne: "Finished" },
    };
    const setStateOne = {
      $set: {
        state: "In Progress",
      },
    };

    const resultOne = await campaignsCollection.updateMany(
      filterOne,
      setStateOne
    );

    const filterTwo = { endDate: { $lt: date } };
    const setStateTwo = {
      $set: {
        state: "Finished",
      },
    };
    const resultTwo = await campaignsCollection.updateMany(
      filterTwo,
      setStateTwo
    );

    const campaign = await campaignsCollection.findOne({ _id: ObjectId(_id) });

    if (campaign && campaign.advertiser === advertiser) {

        let fechaInicio = campaign.startDate.toISOString()
        let fechaFinal = campaign.endDate.toISOString()
  
        fechaInicio = fechaInicio.replace(/-/g, '\/').replace(/T.+/, '');
        fechaFinal = fechaFinal.replace(/-/g, '\/').replace(/T.+/, '');
  
        campaign.startDate = fechaInicio
        campaign.endDate = fechaFinal

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

    date = new Date();
    console.log(date);

    const filterOne = { startDate: { $lte: date }, endDate: { $gte: date } };
    const setStateOne = {
      $set: {
        state: "In Progress",
      },
    };

    const resultOne = await campaignsCollection.updateMany(
      filterOne,
      setStateOne
    );

    const filterTwo = { endDate: { $lt: date } };
    const setStateTwo = {
      $set: {
        state: "Finished",
      },
    };
    const resultTwo = await campaignsCollection.updateMany(
      filterTwo,
      setStateTwo
    );

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
async function cancelCampaing(req, res, databaseConnection) {
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
    const id = ObjectId(req.body.id);

    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");

    date = new Date();

    const filter = { _id: id };
    const setStateCampaign = {
      $set: {
        state: "Finished",
      },
    };

    const result = await campaignsCollection.updateOne(
      filter,
      setStateCampaign
    );
    res.status(200).json({
      message: "Campaign Finished",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
}


async function filterCampaigns(req, res, databaseConnection) {
  try {
    const body = req.body;
    const token = body.token;

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

    const username = prueba.data.username;

    if (username) {
      const userCollection = databaseConnection
        .db("adpolygon")
        .collection("users");

      const user = await userCollection.findOne({ username: username });

      const { age, language, gender } = user.data;
      const ageP = parseInt(age);

     

      const campaignsCollection = databaseConnection
        .db("adpolygon")
        .collection("campaigns");

      const campaignFilter = await campaignsCollection.find({
        $and: [
          { "rules.language": { $eq: language } },
          {
            $or: [
              { "rules.gender": { $eq: gender } },
              { "rules.gender": "Both" },
            ],
          },
          {
            $and: [
              { "rules.ageMax": { $gte: ageP } },
              { "rules.ageMin": { $lte: ageP } },
            ],
          },

          { $or: [{ state: "In Progress" }, { state: "Created" }] },
        ],
      });
  
      const campañas = await campaignFilter.toArray();

      res.status(200).json({
        message: "Campaign filter",
        success: true,
        campañas,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function favoriteCampaigns(req, res, databaseConnection) {
  try {
    const body = req.body;
    const token = body.token;
    const nameCampaign = body.nameCampaign;

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

    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");
    const userInfo = await usersCollection.findOne({ username: advertiser });
    const favoritesLength = userInfo.favorites.length;

    if (userInfo) {
      const campaignsCollection = databaseConnection
        .db("adpolygon")
        .collection("campaigns");
      const campaignInfo = await campaignsCollection.findOne({
        name: nameCampaign,
      });
      if (campaignInfo) {
        //await usersCollection.find({ favorites: {name: campaignInfo.name } })
let verificadorRep= false

        let aux= userInfo.favorites.forEach(campaign => {
          if( campaign.name === campaignInfo.name){
            verificadorRep= true
          }
        });

        if(verificadorRep === true){
          res.status(406).json({
            message: 'Not acceptable',
            success: false
          })
        }else{
          usersCollection.updateOne(
           { username: advertiser },
           { $set: { [`favorites.${favoritesLength}`]: campaignInfo } }
         );
         res.status(200).json({
           message: "Add campaign to favorite",
           success: true,
         }); 
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function favoriteCampaignsList(req, res, databaseConnection) {
  try {
    const body = req.body;
    const token = body.token;
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
    const username = prueba.data.username;
    const usersCollection = databaseConnection
    .db("adpolygon")
    .collection("users");
  const userInfo = await usersCollection.findOne({ username: username });
  const favorites = userInfo.favorites

  res.status(200).json({
    message: "List favorite campaign",
    success: true,
    favorites:favorites
  });

  } catch (error) {
    console.log(error)
  }
}
async function publisherSpecificSearch(req, res, databaseConnection) {
  
  try {
    const advertiserSearch = req.body.nameSearchFor;
    const nameSearch = req.body.nameSearchFor;
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

    const query = { username: user };
    const data = await usersCollection.findOne(query);

    const userLanguage = data.data.language;
    const userGender = data.data.gender;
    const userAge = parseInt(data.data.age);

    const campaignsCollection = databaseConnection
      .db("adpolygon")
      .collection("campaigns");

    date = new Date();

    const filterOne = {
      startDate: { $lte: date },
      endDate: { $gte: date },
      state: { $ne: "Finished" },
    };
    const setStateOne = {
      $set: {
        state: "In Progress",
      },
    };

    await campaignsCollection.updateMany(filterOne, setStateOne);

    const filterTwo = { endDate: { $lt: date } };
    const setStateTwo = {
      $set: {
        state: "Finished",
      },
    };
    await campaignsCollection.updateMany(filterTwo, setStateTwo);

    const queryUser = {
      $and: [
        { "rules.language": { $eq: userLanguage } },
        {
          $or: [
            { "rules.gender": { $eq: userGender } },
            { "rules.gender": "Both" },
          ],
        },
        {
          $and: [
            { "rules.ageMax": { $gte: userAge } },
            { "rules.ageMin": { $lte: userAge } },
          ],
        },

        { $or: [{ state: "In Progress" }, { state: "Created" }] },
        {
          $or: [
            { advertiser: { $regex: `.*${advertiserSearch}`, $options: "i" } },
            { name: { $regex: `.*${nameSearch}`, $options: "i" } },
          ],
        },
      ],
    };

    const allSearch = await campaignsCollection.find(queryUser).toArray();
    if (allSearch[0]) {
      return res.status(200).json({
        success: true,
        message: "Campaigns Ok.",
        campaigns: allSearch,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "No campaign has been uploaded yet.",
      });
    }
  } catch (err) {
    console.log(err);
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
  cancelCampaing: cancelCampaing,
  filterCampaigns: filterCampaigns,
  favoriteCampaigns: favoriteCampaigns,
  favoriteCampaignsList:favoriteCampaignsList,
  publisherSpecificSearch: publisherSpecificSearch
};
