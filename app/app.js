
const socket = io('ws://localhost:8080');

var messages = ["1 ", "2 ", "3 ", "4 ", "5 ", "6 "]

ul = document.getElementById("messages")
messages.forEach(function (message) {
    let li = document.createElement('li');
    ul.appendChild(li);

    li.innerHTML += message;
});

socket.on('message', text => {

    messages.push(text)
    messages.shift()
    
    ul = document.getElementById("messages")

    let li = document.createElement('li');
    ul.appendChild(li);
    
    li.innerHTML = messages[messages.length - 1];

});

document.querySelector('button').onclick = () => {

    const text = document.querySelector('input').value;
    socket.emit('message', text)
    document.querySelector('input').value='';
}

