const io = require('socket.io')(3000)

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
var name = "John Doe";

// Index.html at localholst:3001/
app.get("/",(req,res)=>{
    res.set({
        "Allow-access-Allow-Origin": '*'
    })
    return res.redirect('index.html');
}).listen(3001);

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

// Chat, insert messages in the database + detect (de)connection
io.on('connection', (socket) => {
    // io.emit('message', `${name} joined the chat` )
    
    Messages.find().then(result => {
        socket.emit('output-messages', result)
    })

    socket.on('message', msg => {
        console.log(msg)

        msg = `${name} sent: ${msg}`

        const message = new Messages({ msg });
        message.save().then(() => {
            io.emit('message', `${msg}` )
        })
    })

    // socket.on('disconnect', () => {
    //     io.emit('message', `${name} left the chat` )
    // });
});
