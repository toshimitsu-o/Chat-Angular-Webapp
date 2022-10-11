module.exports = function(db,app){

    // Route to get all channels from database and return all
    app.get('/channel', async function(req,res){
        const collection = await db.collection('channels');
        const docs = await collection.find({}).toArray((err,data)=>{
            res.send(data);
        });
    });

    // Route to add new channel to database
    app.post('/channel', async function(req,res){

        if (!req.body) {
            return res.sendStatus(400)
        }
        channel = req.body;
        const collection = await db.collection('channels');
        collection.find({'id':channel.id}).count((err,count) =>{
            if (count == 0) { // if no duplicate
                collection.insertOne(channel, (err,dbres) => {
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

    // Route to lookup channel and update details in database
    app.put('/channel', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        let channel = req.body;
        const filter = { id: channel.id };
        // Set options
        const options = { upsert: false};
        // Create a document to set
        const updateDoc = {
            $set: { id: channel.id, name:  channel.name, gid: channel.gid }
        };

        const collection = await db.collection('channels');
        collection.find({ 'id': channel.id }).count((err, count) => {
            if (count == 0) { // if the channel doesn't exist
                return res.send({ err: "channel does not exist" });
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

    // Route to lookup channel and delete it from database
    app.delete('/channel/:id', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        let channelId = req.params.id;
        const collection = await db.collection('channels');
        collection.find({ 'id': channelId }).count((err, count) => {
            if (count == 0) { // if the channel doesn't exist
                return res.send({ err: "channel does not exist" });
            } else {
                // Delete one item
                collection.deleteOne({ 'id':channelId }, (err, docs) => {
                    if (err) throw err;
                    // Get a new list and return it back
                    collection.find({}).toArray((err, data) => {
                        res.send(data);
                    });
                });
            }
        });
    });
}