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

                'name': name,
                "imgUrl": imgUrl,
                'description': description,
                'state': state,
                'advertiser': advertiser,
                'startDate': startDate,
                'endDate': endDate,
                'data': data,

            };

            const campaignsCollection = databaseConnection.db('adpolygon').collection('campaigns');
            const previousCampaign = await campaignsCollection.findOne({ name: body.name });

            if(previousCampaign){
                return res.status(400).json({
                    'success': false,
                    'message': 'The user has already created a campaing with this name.'
                })
            }

            if(new Date(`<${startDate}>`)< new Date()){
                return res.status(400).json({
                    'success': false,
                    'message': 'Start date has already passed.'
                })
            }

            if(new Date(`<${startDate}>`) > new Date(`<${endDate}>`)){
                return res.status(400).json({
                    'success': false,
                    'message': 'End date cannot be before Start date.'
                })
            }

            await campaignsCollection.insertOne(campaign);

            res.status(200).json({

                'success': true,
                'message': 'The campaign has been succesfully created.'

            });
        }
    } catch (err) {
    console.log(err);
  }
}

async function update(req, res, databaseConnection) {

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

        const campaignsCollection = databaseConnection.db('adpolygon').collection('campaigns');

        const allCampaigns = await campaignsCollection.findOne({ advertiser:advertiser });

        if(allCampaigns) {
            return res.status(200).json({
                success: true,
                message: "Campaigns Ok.",
                campaigns: allCampaigns,
              });
        }else {
            return res.status(400).json({
                success: true,
                message: "Advertiser hasn´t uploaded any campaign yet."
              });
        }
    } catch (error) {
        console.log( error);
      }

}

async function advertiserSpecificCampaign(req, res, databaseConnection) {
    var ObjectId = require('mongodb').ObjectId; 

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
        const _id = req.body.id

        const campaignsCollection = databaseConnection.db('adpolygon').collection('campaigns');

        const campaign = await campaignsCollection.findOne({_id: ObjectId(_id)})

        if(campaign && (campaign.advertiser === advertiser)) {
            return res.status(200).json({
                success: true,
                message: "Campaigns Ok.",
                campaigns: campaign,
              });
        }else {
            return res.status(400).json({
                success: true,
                message: "Something wen´t wrong, information not available."
              });
        }
    } catch (error) {
        console.log( error);
      }

}

async function allCampaigns (req, res, databaseConnection) {

    try {
        const campaignsCollection = databaseConnection.db('adpolygon').collection('campaigns');

        const allCampaigns = await campaignsCollection.find();

        console.log(allCampaigns)

        if(allCampaigns) {
            return res.status(200).json({
                success: true,
                message: "Campaigns Ok.",
                campaigns: allCampaigns,
              });
        }else {
            return res.status(400).json({
                success: true,
                message: "No campaign has been uploaded yet."
              });
        }


    } catch (error) {
        console.log( error);
      }

}



module.exports = {

    "run": run,
    "allCampaigns": allCampaigns,
    "advertiserCampaigns": advertiserCampaigns,
    "advertiserSpecificCampaign": advertiserSpecificCampaign

}