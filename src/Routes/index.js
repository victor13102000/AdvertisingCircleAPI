const express = require("express");
const routes = express.Router();
const user = require('./user')

routes.use("/user", user);

routes.get('/hola', (req, res)=>{
    console.log(req.body)
})

module.exports= routes