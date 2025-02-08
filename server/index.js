const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const corsOptions = {
    origin: 'http://localhost:3000',
    methods: 'PUT, GET, HEAD, POST, DELETE, OPTIONS'
};
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('Server is running');
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', (data) => {
        io.emit('receiveMessage', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});