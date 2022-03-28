global.config = require('../config.json');

const database = require('./database.js');

const express = require('express');
const cors = require('cors');

const createCampaign = require('../src/create/campaign');

(async () => {

    const databaseConnection = await database.getConnection(global.config.database.url);

    const app = express();

    app.use(cors({

        origin: '*'

    }));

    app.post('/create/campaign', (req, res) => { createCampaign.run(req, res, databaseConnection); });

    app.listen(global.config.port, () => console.log('SERVER UP | Port: ' + global.config.port));

})();