module.exports = function(db,app){
    // Route to check username and password from database and return user info
    app.post('/auth/login', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        var username = req.body.username;
        var pwd = req.body.pwd;


        const collection = await db.collection('users');
        const docs = await collection.find({ 'username': username }).toArray();
        if (docs.length != 1) {
            res.send({
                "valid": false
            });
        } else if (docs[0].pwd == pwd) {
            docs[0].valid = true;
            res.send(docs[0]);
        } else {
            res.send({
                "valid": false
            });
        }
    });

    // Route to lookup user and update details to database
    app.post('/auth/update', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        let user = req.body;
        const filter = { username: user.username };
        // Set options
        const options = { upsert: false};
        // Create a document to set
        const updateDoc = {
            $set: { username: user.username, email:  user.email, role: user.role, pwd: user.pwd, avatar: user.avatar }
        };

        const collection = await db.collection('users');
        collection.find({ 'username': user.username }).count((err, count) => {
            if (count == 0) { // if the user doesn't exist
                return res.send({ err: "user does not exist" });
            } else {
                // Update one item
                collection.updateOne(filter, updateDoc, options, (err, docs) => {
                    if (err) throw err;
                    if (docs.modifiedCount == 1) {
                        collection.find({ 'username': user.username }).toArray()
                        .then(data => {
                            return res.send(data[0])
                        });
                    }
                });
            }
        });
    });
}