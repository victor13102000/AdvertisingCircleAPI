async function runUser(req, res, databaseConnection) {

    const body = req.body;

   
    const username = body.username; //token del user
    const type= body.type
    const data={
        'firstName': body.firstName,
        'lastName':body.lastName,
        'language': body.language,
        'gender': body.gender,
        'age': body.age,
        'instagram': body.instagram,
        'tikTok': body.tikTok,
        'youtube': body.youtube,
        'twitter': body.twitter
    } 



        const user = {

             'username' : username,
                'type': type,
                'data': data
          }
    

        const usersCollection = databaseConnection.db('adpolygon').collection('users');

        await usersCollection.insertOne(user);

        res.status(200).json({

            'success': true,
            'message': 'User creado correctamente.'

        });

    }



module.exports = {

    "runUser": runUser

}