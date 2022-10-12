const express = require('express'); // Import express.js for routing
const bodyParser = require('body-parser');
const app = express(); // The app object denotes the express application.
// Cross origin recource sharing to cater for port 4200 and 3000
// parse requests
// app.use(bodyParser.urlencoded({
//     extended: true
// }));
// app.use(bodyParser.json());
const cors = require('cors');
const path = require('path');
var fs = require('fs');
const formidable = require('formidable');
const https = require('https');
options = {
    //generate a SSL certificate in the elf terminal.
    //openssl genrsa -out key.pem
    //openssl req -new -key key.pem -out csr.pem
    //openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
    //rm csr.pem
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};
httpsServer = https.createServer(options, app);
const PORT = 3000;
// Socket io
const io = require('socket.io')(httpsServer,{
    cors: {
        // origin: "https://s5251464.elf.ict.griffith.edu.au:3002",
        // methods: ["GET", "POST", "PUT", "DELETE"]
        origin: "*"
    }
});
const sockets = require('./socket.js');

// Peer Server
const { PeerServer } = require('peer');
const peerServer = PeerServer({
    port: 3001,
    ssl: {
        key: fs.readFileSync('../server.key'),
        cert: fs.readFileSync('../server.crt')
    }
});

app.use('/images',express.static(path.join(__dirname , './userimages')));

// Apply express midleware
app.use(cors());
app.use(express.json()); // Mounts the specified middleware function

// Point to Angular web page
app.use(express.static(__dirname + '../dist/chat/'));
console.log(__dirname);

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

    // Routes for API messages
    require('./router/messages.js')(db, app);

    // Route for image upload
    require('./router/uploads.js')(app,formidable,fs,path);

});
httpsServer.listen(PORT, () => {
    console.log(`Starting https server at: ${PORT}`);
});
module.exports = app;