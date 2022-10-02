module.exports = function(db,app){

    // Route to get all channel member data from database and return all
    app.get('/member/channel', async function(req,res){
        const collection = await db.collection('channelMembers');
        const docs = await collection.find({}).toArray((err,data)=>{
            res.send(data);
        });
    });

    // Route to add new channel member to database
    app.post('/member/channel', async function(req,res){

        if (!req.body) {
            return res.sendStatus(400)
        }
        member = req.body;
        const collection = await db.collection('channelMembers');
        collection.find({$and: [{'username': member.username }, {'cid': member.cid }]}).count((err,count) =>{
            if (count == 0) { // if no duplicate
                collection.insertOne(member, (err,dbres) => {
                    if (err) throw err;
                    // Get a new list and return it back
                    collection.find({}).toArray((err, data) => {
                        res.send(data);
                    });
                });
            } else {
                res.send({num:0, err: "duplicate item"});
            }
        });
    });

    // Route to lookup member and delete it from database
    app.delete('/member/channel/:username/:cid', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        let user = req.params.username;
        let cid = req.params.cid;
        const collection = await db.collection('channelMembers');
        collection.find({ $and: [{'username': user }, {'cid': cid }]}).count((err, count) => {
            if (count == 0) { // if the group doesn't exist
                return res.send({ err: "member does not exist" });
            } else {
                // Delete one item
                collection.deleteOne({ $and: [{'username': user }, {'cid': cid }] }, (err, docs) => {
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