async function runUser(req, res, databaseConnection) {
  const body = req.body;

  const username = body.username; //token del user
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

  await usersCollection.insertOne(user);

  res.status(200).json({
    success: true,
    message: "User creado correctamente.",
  });
}

async function updateUser(req, res, databaseConnection) {
  const username = req.body.username;
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
  } = req.body;

  const usersCollection = databaseConnection
    .db("adpolygon")
    .collection("users");

  await usersCollection.updateOne(
    { username },
    {
      $set: {
        "data.firstName": firstName,
        "data.lastName": lastName,
        "data.language": language,
        "data.gender": gender,
        "data.age": age,
        "data.instagram": instagram,
        "data.tikTok": tikTok,
        "data.youtube": youtube,
        "data.twitter": twitter,
      },
    }
  );

  res.status(200).json({
    success: true,
    message: "Data cargada correctamente.",
  });
}

async function dataUser(req, res, databaseConnection){
  const user= req.body.username;
  const usersCollection = databaseConnection.db("adpolygon").collection("users");
 const data= await usersCollection.findOne({"username":user})
  res.status(200).json({
    success: true,
    message: "Informacion extraida correctamente",
    data: data
  });
}

module.exports = {
  runUser: runUser,
  updateUser: updateUser,
  dataUser:dataUser
};
