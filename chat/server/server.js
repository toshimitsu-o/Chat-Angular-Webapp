const express = require('express'); // Import express.js for routing
const app = express(); // The app object denotes the express application.
// Cross origin recource sharing to cater for port 4200 and 3000
const cors = require('cors');
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

// Setup Socket
sockets.connect(io, PORT);

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://chatty:XP2rK8i4AY0drD0L@cluster0.exw15mo.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const db = client.db("chatty");

    // Callback function code. Start the rest of the app after connection starts
    if (err) {return console.log(err)}
    console.log("Connected")

    // Routes for API authentication
    require('./router/auth.js')(db, app);
    //app.post('/auth/login', require('./router/userLogin.js'));
    //app.post('/auth/update', require('./router/userUpdate.js'));

    // Routes for API admin users
    require('./router/users.js')(db, app);

    // Routes for API group
    app.get('/group/:gid', require('./router/getGroup.js'));
    app.put('/group/', require('./router/putGroup.js'));

    // Routes for API channel
    app.get('/channel/:gid/:cid', require('./router/getChannel.js'));
    app.put('/channel/', require('./router/putChannel.js'));

    // Routes for API group
    app.get('/member/group', require('./router/getGroupMember.js'));
    app.put('/member/group', require('./router/putGroupMember.js'));

    // Routes for API channel
    app.get('/member/channel', require('./router/getChannelMember.js'));
    app.put('/member/channel/', require('./router/putChannelMember.js'));

    // Start server listening for requests
    server.listen(http, PORT);
});
module.exports = app;