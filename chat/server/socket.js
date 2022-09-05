module.exports = {
    connect: function(io, PORT){
        io.on('connection', (socket)=> {
            // When a connection request come in output to the server console
            console.log('user connection on port ' + PORT + ' : ' + socket.id);

            // When a message comes in emit it back to all sockets with the message
            socket.on('message', (message)=>{
                io.emit('message', message);
            })
        });
    }
}