const { MongoClient, ServerApiVersion } = require('mongodb');

async function getConnection(url) {

    const connection = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
        .catch(err => { throw new Error('Database connection error: ' + err); });

    if (connection) { console.log('Successful connection to database!'); } else { throw new Error('Database connection error: Unknown'); }

    return connection;

}

module.exports = { 'getConnection': getConnection }