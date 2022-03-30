 const express = require("express"); 
 const users = express.Router() 

 const database = require('../database');
/*  export default async (req, res) => {
  if (req.method === "POST") {
    const { db } = await connectToDatabase();
    const data = req.body;
    const resp = await db.collection("collectionName").insertOne(data);
    res.status(200).send(resp);
  }
}; 
 */
 users.post("/", async (req, res) => {
  try {
    const { db } = await database.getConnection(global.config.database.url);
    const data = req.body;
    const response = await db.collection("users").insertOne(data);
    res.status(200).send(response);
  } catch (err) {
    console.log(err);
  }
}); 

module.exports= users