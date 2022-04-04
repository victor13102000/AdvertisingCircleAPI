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

            const usersCollection = databaseConnection.db("adpolygon").collection("users");
            const campaignsCollection = databaseConnection.db('adpolygon').collection('campaigns');

            const previousAdvertiser = await usersCollection.findOne({ username: advertiser });
            const previousCampaign = await campaignsCollection.findOne({ name: body.name });

            if(previousAdvertiser && previousCampaign){
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



module.exports = {

    "run": run

}