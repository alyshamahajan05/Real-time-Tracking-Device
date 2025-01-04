const express = require('express');
const app = express();
const http = require('http');
const path = require('path');

const socketio = require('socket.io');
const server  = http.createServer(app);
const io = socketio(server);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public'))); // Corrected line

io.on('connection', (socket) => {
  socket.on('send-location', (coords) => {
    io.emit('receive-location', {id: socket.id, ...coords
    });
  });
  console.log('New WebSocket connection');
});

app.get('/', (req, res) => {
  res.render('index');
});

server.listen(3000);
console.log('Server running on port 3000');