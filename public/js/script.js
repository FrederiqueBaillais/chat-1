function showLogin() {
    document.getElementById('registerForm').classList.add("hidden")
    document.getElementById('loginForm').classList.remove("hidden")
}

function showRegister() {
    document.getElementById('registerForm').classList.remove("hidden")
    document.getElementById('loginForm').classList.add("hidden")
}

const socket = io('http://localhost:3000');
const messages = document.getElementById('messages');
const messageForm = document.getElementById('messageForm');

socket.on('message', data => {
    console.log(data)
    appendMessages(data)
})
socket.on('output-messages', data => {
    console.log(data)
    if (data.length) {
        data.forEach(message => {
            appendMessages(message.msg)
        });
    }
})

messageForm.addEventListener('submit', e => {
    e.preventDefault()
    socket.emit('message', messageForm.msg.value)
    console.log('submit from msgfrom', messageForm.msg.value)
    messageForm.msg.value = '';


})

function appendMessages(message) {
    const html = `<div class="bg-white p-2 m-2 w-3/4">${message}</div>`
    messages.innerHTML += html
}