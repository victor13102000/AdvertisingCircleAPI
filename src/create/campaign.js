async function run(req, res, databaseConnection) {

    const body = req.body;

    const advertiser ='565564654'; //username obtenido del token

    const name = body.name;
    const description = body.description;
    const startDate = body.startDate;
    const endDate = body.endDate;
    const type = body.type;
    const data = body.data;

    // URL campaign
    if (type == 0) {

        const state = 1; // init state

        const campaign = {

            'name': name,
            'description': description,
            'state': state,
            'advertiser': advertiser,
            'startDate': startDate,
            'endDate': endDate,
            'data': data,

        };

        const campaignsCollection = databaseConnection.db('adpolygon').collection('campaigns');

        await campaignsCollection.insertOne(campaign);

        res.status(200).json({

            'success': true,
            'message': 'Campaña creada correctamente.'

        });

    }

}
module.exports = {

    "run": run

}