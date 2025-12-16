const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


app.use(express.static('../public'));


const users = {};


io.on('connection', socket => {


socket.on('joinRoom', ({ username, room }) => {
socket.join(room);
socket.username = username;
socket.room = room;


if (!users[room]) users[room] = [];
users[room].push(username);


io.to(room).emit('roomUsers', users[room]);


socket.to(room).emit('message', {
user: 'System',
text: `${username} joined the chat`,
time: new Date().toLocaleTimeString()
});
});


socket.on('chatMessage', msg => {
io.to(socket.room).emit('message', {
user: socket.username,
text: msg,
time: new Date().toLocaleTimeString()
});
});


socket.on('disconnect', () => {
const room = socket.room;
if (room && users[room]) {
users[room] = users[room].filter(u => u !== socket.username);
io.to(room).emit('roomUsers', users[room]);
socket.to(room).emit('message', {
user: 'System',
text: `${socket.username} left the chat`,
time: new Date().toLocaleTimeString()
});
}
});
});


http.listen(3000, () => console.log('Server running on http://localhost:3000'));