// Login and Register

function showRegister() {
    document.getElementById('registerForm').classList.remove("hidden")
    document.getElementById('loginForm').classList.add("hidden")
}

function showLogin() {
    document.getElementById('registerForm').classList.add("hidden")
    document.getElementById('loginForm').classList.remove("hidden")
}

// Socket

const socket = io('https://www.unpkg.com/socket.io-client@2.3.0/dist/socket.io.js');
const messages = document.getElementById('messages');
const list = document.getElementById('usersList');
const messageForm = document.getElementById('messageForm');

socket.on('log', data => {
    updateUsers(data)
})

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

function updateUsers(log) {

    let arr = log.split(',');

    let html = ''

    arr.forEach(function(item){
        html += `<div>${item}</div>`
      });

    list.innerHTML = html
}

function appendMessages(message) {
    let arr = message.split(" ");
    let array = arr.slice(0, 2).concat(arr.slice(2).join(" "));

    const html = `<div class="text-xs"><span class="text-xl text-gray-800">${array[0]}&nbsp</span> ${array[1]}</div><div class="bg-white p-2 m-2 lg:w-3/4 rounded-md">${array[2]}</div>`
    messages.innerHTML += html
}
