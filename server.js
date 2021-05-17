const io = require('socket.io')(5000)

const express = require("express")
const bodyParser = require("body-parser")
const app = express()

// Static files are stored in public folder
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

// Connection to mongoDB
const mongoose = require('mongoose');
const databaseURL = 'mongodb+srv://chat:chat123@cluster0.sghn8.mongodb.net/message-database?retryWrites=true&w=majority'

mongoose.connect(databaseURL,{ useNewUrlParser: true, useUnifiedTopology: true})
const database = mongoose.connection;
database.on('error',()=>console.log("Not Connected to the Database"));
database.once('open',()=>console.log("Connected to the Database"))

const Messages = require('./models/messages');
const Users = database.collection('users');
var name = "Visitor";

// Index.html at localholst:3001/
app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(5001);

// Register, record and insert infos in the database + redirect to chat.html
app.post("/sign_up",(req,res)=>{
    name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "name": name,
        "email" : email,
        "password" : password
    }

    Users.insertOne(data,(err,collection)=>{
        if(err){
            throw err;
        }
        console.log("Record Successfully Inserted");
    });

    return res.redirect("chat.html");
})

app.post("/connection", (req, res) => {
    name = req.body.name;
    var password = req.body.password;

    Users.findOne({ name }, (err, result) => {
        if (err) throw err;
            console.log(result);
        if (result == null) 
            return res.redirect("index.html")
        if (result.name === name && result.password === password) {
            return res.redirect("chat.html")
        }
        else {
            console.log("Wrong name")
            return res.redirect("index.html")
        }
    })
});

var usersList = [];

// Chat, insert messages in the database + detect (de)connection
io.on('connection', (socket) => {
    // io.emit('message', `${name} joined the chat` )
    usersList.push(name)
    io.emit('log', `${usersList}`  )
    
    Messages.find().then(result => {
        socket.emit('output-messages', result)
    })

    socket.on('message', msg => {
        let hours = new Date().getHours();
        if (hours < 10)
                hours = "0" + hours

        let minutes = new Date().getMinutes();
        if (minutes < 10)
                minutes = "0" + minutes

        let time = `${hours}:${minutes}`;

        msg = `${name} ${time} ${msg}`

        const message = new Messages({ msg });
        message.save().then(() => {
            io.emit('message', `${msg}` )
        })
    })

    socket.on('disconnect', () => {
        for( var i = 0; i < usersList.length; i++){ 
    
            if ( usersList[i] === name) { 
        
                usersList.splice(i, 1); 
            }
        }
        io.emit('log', `${usersList}`  )
    });
});
