const express = require('express');
const app = express();
const http = require("http").createServer(app);
const db = require("./_db");    //replace with Redis
const cors = require("cors");
const io = require("socket.io")(http,{
    cors:{
        origin:"http://localhost:3000",
    },
});

app.use(cors());

http.listen(5000,() => {
    console.log("Server running at port 5000!!")
})

app.get("/join",(req,res,err)=>{

    //console.log("here");
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const roomName = req.query.name;

    if(roomName && roomName.length < 1){
        return res.status(400).send("Room name can't be empty!!");
    }

    if(db.hasOwnProperty(roomName)){
        console.log(db[roomName]);
        return res.status(200).json(db[roomName]);
    }
    return res.status(404).send("Room Not Found!!");
});

app.post("/create",(req,res,err)=>{

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const roomName = req.query.name;
    if(db.hasOwnProperty(roomName)){
        return res.status(409).send("Room already exists!!");
    }

    if(roomName.length < 1){
        return res.status(400).send("Room name can't be empty!!");
    }
    
    db.roomName = {
        "messages":[]
    };

    return res.status(200).send("Room created!!");
});
io.on('connection',(socket) =>{
    console.log('user connected!!');

    socket.on('message', (msg) =>{
        console.log("Message Received:",msg);       // Remove excess logging later for production
        socket.broadcast.emit('message',msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    //socket.emit('chat-message','Hello world')
})