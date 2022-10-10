const express = require('express'); // Import express.js for routing
const app = express(); // The app object denotes the express application.
// Cross origin recource sharing to cater for port 4200 and 3000
const cors = require('cors');
const path = require('path');
var fs = require('fs');
const formidable = require('formidable');
const http = require('http').Server(app);
const io = require('socket.io')(http,{
    cors: {
        origin: "http://localhost:4200",
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});
const sockets = require('./socket.js');
const server = require('./listen.js');

// Degine port used for the server
const PORT = 3000;

app.use('/images',express.static(path.join(__dirname , './userimages')));

// Apply express midleware
app.use(cors());
app.use(express.json()); // Mounts the specified middleware function

// Point to Angular web page
app.use(express.static(__dirname + '../dist/chat/'));
console.log(__dirname);

// Start the server on port 3000.
// app.listen(3000, () => {
//     var d = new Date();
//     var n = d.getHours();
//     var m = d.getMinutes();
//     console.log('Server has been started at: ' + n + ':' + m);
// });



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://chatty:XP2rK8i4AY0drD0L@cluster0.exw15mo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const db = client.db("chatty");

    // Callback function code. Start the rest of the app after connection starts
    if (err) {return console.log(err)}
    console.log("Connected")

    // Setup Socket
    sockets.connect(io, PORT, db);

    // Routes for API authentication
    require('./router/auth.js')(db, app);

    // Routes for API admin users
    require('./router/users.js')(db, app);

    // Routes for API group
    require('./router/group.js')(db, app);

    // Routes for API channel
    require('./router/channel.js')(db, app);

    // Routes for API group members
    require('./router/groupMember.js')(db, app);

    // Routes for API channel members
    require('./router/channelMember.js')(db, app);

    // Route for image upload
    require('./router/uploads.js')(app,formidable,fs,path);

    // Start server listening for requests
    server.listen(http, PORT);
});
module.exports = app;