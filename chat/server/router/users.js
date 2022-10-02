module.exports = function(db,app){

    // Route to get all users data from database and return all
    app.get('/admin/users', async function(req,res){
        const collection = await db.collection('users');
        const docs = await collection.find({}).toArray((err,data)=>{
            res.send(data);
        });
    });

    // Route to add new user to database
    app.post('/admin/users', async function(req,res){

        if (!req.body) {
            return res.sendStatus(400)
        }
        user = req.body;
        const collection = await db.collection('users');
        collection.find({'username':user.username}).count((err,count) =>{
            if (count == 0) { // if no duplicate
                collection.insertOne(user, (err,dbres) => {
                    if (err) throw err;
                    let num = dbres.insertedCount;
                    // Send back number of items inserted
                    res.send({'num': num, err: null});
                });
            } else {
                res.send({num:0, err: "duplicate item"});
            }
        });
    });

    // Route to lookup user and update details to database
    app.put('/admin/users', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        let user = req.body;
        const filter = { username: user.username };
        // Set options
        const options = { upsert: false};
        // Create a document to set
        const updateDoc = {
            $set: { username: user.username, email:  user.email, role: user.role, pwd: user.pwd }
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
                        collection.find({}).toArray()
                        .then(data => {
                            return res.send(data)
                        });
                    }
                });
            }
        });
    });

    // Route to lookup user and delete it from database
    app.delete('/admin/users/:username/:by', async function(req,res){
        if (req.params.username == "all") { // Delete all user except the current user
            let byUsername = req.params.by;
            let query = {username: {$ne: byUsername}};
            const collection = await db.collection('users');
            collection.deleteMany(query, (err, obj) => {
                if (err) throw err;
                collection.find({}).toArray((err, data) => {
                    res.send(data);
                });
            });
        } else { // Delete one user
            let username = req.params.username;
            const collection = await db.collection('users');
            collection.find({ 'username': username }).count((err, count) => {
                if (count == 0) { // if the user doesn't exist
                    return res.send({ err: "user does not exist" });
                } else {
                    // Delete one item
                    collection.deleteOne({ 'username':username }, (err, docs) => {
                        if (err) throw err;
                        // Get a new list and return it back
                        collection.find({}).toArray((err, data) => {
                            res.send(data);
                        });
                    });
                }
            });
        }
    });
}