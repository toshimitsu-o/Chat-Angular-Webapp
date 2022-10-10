module.exports = {
    connect: async function(io, PORT, db){

        let rooms = [];
        //const rooms = ["c1", "c2", "c3"]; // List of rooms
        let socketRoom = []; // List of [socket.id, joined]
        let socketRoomnum = []; // List of [room, number of users]

        // Get channels and copy ids to rooms
        const collection = await db.collection('channels');
        const docs = await collection.find({}).toArray((err,data)=>{
            data.forEach(i => {
                rooms.push(i.id);
            });
        });

        // Setting a namespace
        const chat = io.of('/chat');

        chat.on('connection', (socket)=> {
            // When a connection request come in output to the server console
            console.log('user connection on port ' + PORT + ' : ' + socket.id);

            // When a message comes in emit it back to all sockets with the message
            socket.on('message', async (message) => {
                // Connect to database and save the message
                let now = new Date();
                message.date = now;
                const collection = await db.collection('messages');
                collection.insertOne(message, (err,dbres) => {
                    if (err) throw err;
                    // Then emit it to all sockets
                    for (i=0; i<socketRoom.length; i++){
                        // Check to see if current socket id is in the room
                        if (socketRoom[i][0] == socket.id) {
                            // emit to the room
                            chat.to(socketRoom[i][1]).emit('message', message);
                        }
                    }
                });
            });

            // By request, adding a new room
            socket.on("newroom", (newroom)=>{
                // Check if already exists
                if (rooms.indexOf(newroom) == -1) {
                    // Add the new room to the list
                    rooms.push(newroom);
                    // Send back the updated room list
                    chat.emit("roomlist", JSON.stringify(rooms));
                }
            });

            // Send back the room list
            socket.on("roomlist", (m)=> {
                chat.emit("roomlist", JSON.stringify(rooms));
            });

            // Return number of users in the room
            socket.on("numusers", (room)=> {
                // var usercount = 0;
                // for (i=0; i<socketRoomnum.length; i++) {
                //     if(socketRoomnum[i][0] == room) {
                //         usercount = socketRoomnum[i][1];
                //     }
                // }

                // Emit numusers
                const roomIn = socketRoomnum.find(i => i[0] == room);
                if (roomIn) {
                    // Send back the user count
                    chat.in(room).emit("numusers", roomIn[1]);
                }
                
            });

            // Join a room
            socket.on("joinRoom", async (room)=>{
                if(rooms.includes(room)) {
                    await socket.join(room);
                    // Check if already in a room
                    let inroomSocketarray = false;

                    for (i=0; i<socketRoom.length; i++) {
                        // Track who is in each room
                        if (socketRoom[i][0] == socket.id) {
                            socketRoom[i][1] = room;
                            inroomSocketarray = true;
                        }
                    }
                    if (inroomSocketarray == false) {
                        // Add socketif/room record
                        socketRoom.push([socket.id, room]);

                        // recalculate number of users in a room
                        let hasroomnum = false;
                        for (let j=0; j<socketRoomnum.length; j++) {
                            if (socketRoomnum[j][0] == room){
                                socketRoomnum[j][1] += 1;
                                hasroomnum = true;
                            }
                        }
                        // Start tracking numbers of users in a room if it hasn't been done already
                        if (hasroomnum == false) {
                        socketRoomnum.push([room, 1]);
                    }
                    }

                    // Send notice
                    chat.in(room).emit("notice", "A new user has joined");
                    // Emit numusers
                    const roomIn = socketRoomnum.find(i => i[0] == room);
                    if (roomIn) {
                        // Send back the user count
                        chat.in(room).emit("numusers", roomIn[1]);
                    }
                    return chat.in(room).emit("joined", room);
                }
            });

            // Leave a room
            socket.on("leaveRoom", (room)=> {
                // Remove socket id from list
                for (let i=0; i<socketRoom.length; i++) {
                    if (socketRoom[i][0] == socket.id) {
                        socketRoom.splice(i,1);
                        socket.leave(room);
                        chat.to(room).emit("notice", "A user has left");
                    }
                }
                // Update number of users
                for (let j=0; j<socketRoomnum.length; j++) {
                    if(socketRoomnum[j][0] == room) {
                        socketRoomnum[j][1] -= 1;
                        if(socketRoomnum[j][1] == 0) {
                            socketRoomnum.splice(j,1);
                        }
                    }
                }
                // Emit numusers
                const roomIn = socketRoomnum.find(i => i[0] == room);
                if (roomIn) {
                    // Send back the user count
                    chat.in(room).emit("numusers", roomIn[1]);
                }
            });

            // Disconnect from the socket
            socket.on("close", ()=> {
                chat.emit("close");
                // Remove socket id from list
                for (let i=0; i<socketRoom.length; i++) {
                    if (socketRoom[i][0] == socket.id) {
                        socketRoom.splice(i,1);
                    }
                }
                // Update number of users
                for (let j=0; j<socketRoomnum.length; j++) {
                    if(socketRoomnum[j][0] == socket.room) {
                        socketRoomnum[j][1] -= 1;
                        if(socketRoomnum[j][1] == 0) {
                            socketRoomnum.splice(j,1);
                        }
                    }
                }
                console.log("Client disconnected.");
            });

        });
    }
}