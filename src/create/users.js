const axios = require("axios");
const https = require("https");

axios.default.httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

async function runUser(req, res, databaseConnection) {
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

    const username = prueba.data.username;

    const type = body.type;
    const data = {
      firstName: body.firstName,
      lastName: body.lastName,
      language: body.language,
      gender: body.gender,
      age: body.age,
      instagram: body.instagram,
      tikTok: body.tikTok,
      youtube: body.youtube,
      twitter: body.twitter,
    };

    const user = {
      username: username,
      type: type,
      data: data,
    };

    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");

    const usuarioExistente = await usersCollection.findOne({
      username: username,
    });
    console.log(usuarioExistente);

    if (!usuarioExistente) {
      await usersCollection.insertOne(user);
      if (!username) {
        res.status(404).json({
          success: false,
          message: "User undefined",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "User creado correctamente.",
          user: user,
        });
      }
    } else {
      res.status(200).json({
        succes: true,
        message: "login correcto",
        user: usuarioExistente,
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateUserType(req, res, databaseConnection) {
  try {
    const tipo = req.body.type;
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

    const username = prueba.data.username;
    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");

    await usersCollection.updateOne(
      { username },
      {
        $set: {
          type: tipo,
        },
      }
    );

    res.status(200).json({
      message: "Datos cargados",
      succes: true,
    });
  } catch (err) {
    console.log(err);
  }
}

async function updateUser(req, res, databaseConnection) {
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

    const username = prueba.data.username;
    const {
      firstName,
      lastName,
      language,
      gender,
      age,
      instagram,
      tikTok,
      youtube,
      twitter,
    } = req.body.data;

    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");

    await usersCollection.updateOne(
      { username },
      {
        $set: {
          "data.firstName": firstName != "" && firstName,
          "data.lastName": lastName != "" && lastName,
          "data.language": language != "" && language,
          "data.gender": gender != "" && gender,
          "data.age": age != "" && age,
          "data.instagram": instagram != "" && instagram,
          "data.tikTok": tikTok != "" && tikTok,
          "data.youtube": youtube != "" && youtube,
          "data.twitter": twitter != "" && twitter,
        },
      }
    );
    res.status(200).json({
      message: "Datos cargados",
      succes: true,
    });
  } catch (err) {
    console.log(err);
  }
}

async function dataUser(req, res, databaseConnection) {
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

    const username = prueba.data.username;
    const usersCollection = databaseConnection
      .db("adpolygon")
      .collection("users");
    const data = await usersCollection.findOne({ username: username });
    if (data === null) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User OK",
        data: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  runUser: runUser,
  updateUser: updateUser,
  updateUserType: updateUserType,
  dataUser: dataUser,
};
