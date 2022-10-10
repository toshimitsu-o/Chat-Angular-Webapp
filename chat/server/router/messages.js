module.exports = function(db,app){

    // Route to get one user data from database and return it
    app.get('/messages/:cid/:limit', async function(req,res){
        let cid = req.params.cid;
        let limit = Number(req.params.limit);
        const collection = await db.collection('messages');
        collection.find({ 'to': cid }).sort({'date':1}).limit(limit).toArray((err,data)=>{
            if (err) throw err;
            res.send(data);
        });
    });

}