
const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

var clients = {};

io.on('connection', (socket) => {
    console.log('a user connected');

    clients[socket.id] = {name: 'Your name'};

    socket.on('message', (message) =>     {
        console.log(message);
        io.emit('message', `${socket.id} : ${message}` );   
    });
});

http.listen(8080, () => console.log('listening on http://localhost:8080') );

 
