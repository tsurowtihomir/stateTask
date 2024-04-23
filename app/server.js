const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

let buttonState = false;

io.on('connection', (socket) => {
    socket.emit('buttonStateChange', buttonState);

    socket.on('buttonStateChange', (state) => {
        buttonState = state;
        io.emit('buttonStateChange', state);
    });
});

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
