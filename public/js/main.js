
const chatForm = document.getElementById('chat-form')
const chatMessage = document.querySelector('.chat-messages')
const roonName = document.getElementById('room-name')
const userList = document.getElementById('users')

// Get username and room from URL 
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix : true
})

const socket = io();

// Join chat room
socket.emit('joinRoom', { username, room })

// Message from server
socket.on('message', message => {
    console.log(message)
    outputMessage(message)

    // Scroll down
    chatMessage.scrollTop = chatMessage.scrollHeight;

});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room)
    outputUsers(users)    
})

// Message Submit 

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get message text
    const msg = e.target.elements.msg.value

    // Emit message to server
    socket.emit('chatMessage', msg)

    // Clear input and focus the input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();

})

// Output message to DOM 
function outputMessage (message) {
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `
        <p class="meta">${message.username} <span>${message.time}</span></p>
        <p class="text">
        ${message.text}
        </p>
    `;

    document.querySelector('.chat-messages').appendChild(div);
}

// Add room to room
function outputRoomName(room) {
    roonName.innerText = room
}

function outputUsers (users) {
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}

