module.exports = function(db,app){

    // Route to get all groups data from database and return all
    app.get('/member/group', async function(req,res){
        const collection = await db.collection('groupMembers');
        const docs = await collection.find({}).toArray((err,data)=>{
            if (err) throw err;
            res.send(data);
        });
    });

    // Route to add new group member to database
    app.post('/member/group', async function(req,res){

        if (!req.body) {
            return res.sendStatus(400)
        }
        member = req.body;
        const collection = await db.collection('groupMembers');
        collection.find({$and: [{'username': member.username }, {'gid': member.gid }]}).count((err,count) =>{
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
    app.delete('/member/group/:username/:gid', async function(req,res){
        if (!req.body) {
            return res.sendStatus(400)
        }
        let user = req.params.username;
        let gid = req.params.gid;
        const collection = await db.collection('groupMembers');
        collection.find({ $and: [{'username': user }, {'gid': gid }]}).count((err, count) => {
            if (count == 0) { // if the group doesn't exist
                return res.send({ err: "member does not exist" });
            } else {
                // Delete one item
                collection.deleteOne({ $and: [{'username': user }, {'gid': gid }] }, (err, docs) => {
                    if (err) throw err;
                    // Get a new list and return it back
                    console.log(docs)
                    collection.find({}).toArray((err, data) => {
                        res.send(data);
                    });
                });
            }
        });
    });
}