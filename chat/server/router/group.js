module.exports = function(db,app){

    // Route to get all groups data from database and return all
    app.get('/group', async function(req,res){
        const collection = await db.collection('groups');
        const docs = await collection.find({}).toArray((err,data)=>{
            res.send(data);
        });
    });

    // Route to add new group to database
    app.post('/group', async function(req,res){

        if (!req.body) {
            return res.sendStatus(400)
        }
        group = req.body;
        const collection = await db.collection('groups');
        collection.find({'id':group.id}).count((err,count) =>{
            if (count == 0) { // if no duplicate
                collection.insertOne(group, (err,dbres) => {
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

    // Route to lookup group and update details in database
    app.put('/group', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        let group = req.body;
        const filter = { id: group.id };
        // Set options
        const options = { upsert: false};
        // Create a document to set
        const updateDoc = {
            $set: { id: group.id, name:  group.name }
        };

        const collection = await db.collection('groups');
        collection.find({ 'id': group.id }).count((err, count) => {
            if (count == 0) { // if the group doesn't exist
                return res.send({ err: "group does not exist" });
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
    app.delete('/group/:id', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        let groupId = req.params.id;
        const collection = await db.collection('groups');
        collection.find({ 'id': groupId }).count((err, count) => {
            if (count == 0) { // if the group doesn't exist
                return res.send({ err: "group does not exist" });
            } else {
                // Delete one item
                collection.deleteOne({ 'id':groupId }, (err, docs) => {
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