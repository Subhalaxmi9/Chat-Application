const socket = io();
const params = new URLSearchParams(location.search);
const username = params.get('username');
const room = params.get('room');


socket.emit('joinRoom', { username, room });


const usersUL = document.getElementById('users');
const messagesDiv = document.getElementById('messages');
const form = document.getElementById('chat-form');
const msgInput = document.getElementById('msg');
const emojiBtn = document.getElementById('emoji');


socket.on('roomUsers', users => {
usersUL.innerHTML = users.map(u => `<li>🟢 ${u}</li>`).join('');
});


socket.on('message', data => {
const div = document.createElement('div');
div.className = 'message';
div.innerHTML = `
<div class="meta">${data.user} <span>${data.time}</span></div>
<div class="text">${data.text}</div>
`;
messagesDiv.appendChild(div);
messagesDiv.scrollTop = messagesDiv.scrollHeight;
});


emojiBtn.onclick = () => msgInput.value += '😊';


form.addEventListener('submit', e => {
e.preventDefault();
if (!msgInput.value) return;
socket.emit('chatMessage', msgInput.value);
msgInput.value = '';
});