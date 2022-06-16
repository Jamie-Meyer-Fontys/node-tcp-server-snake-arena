// Include Nodejs' net module.
const net = require('net');
// The port on which the server is listening.
const port = 4040;
// Use net.createServer() in your code. This is just for illustration purpose.
// Create a new TCP server.
const server = new net.Server();
// connected client sockets
const players = [];
// The server listens to a socket for a client to make a connection request.
// Think of a socket as an end point.
server.listen(port, function () {
    console.log(`Server listening for connection requests on socket localhost:${port}.`);
});

// When a client requests a connection with the server, the server creates a new
// socket dedicated to that client.
server.on('connection', function (socket) {
    console.log('A new connection has been established.');
    // add player
    players.push(socket);
    // The server can also receive data from the client by reading from its socket.
    socket.on('data', function (chunk) {
        //console.log(`msg size: ${chunk.length}\n`);
        players.forEach(player => {
            // broadcast message to other players
            if (player !== socket) {
                player.write(chunk);
            }
        });
    });

    // When the client requests to end the TCP connection with the server, the server
    // ends the connection.
    socket.on('end', function () {
        console.log('Closing connection with the client');
        // remove player
        players.splice(players.indexOf(socket), 1);
    });

    // Don't forget to catch error, for your own sake.
    socket.on('error', function (err) {
        console.log(`Error: ${err}`);
    });
});
