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

app.get("/join",(req,res)=>{

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const roomName = req.query.name;

    if(!roomName){
        return res.status(400).send("Room name can't be empty!!");
    }

    if(roomName.length < 1){
        return res.status(400).send("Room name can't be empty!!");
    }
    if(db.hasOwnProperty(roomName)){
        //console.log(db[roomName]);
        return res.status(200).json(db[roomName]);
    }
    res.status(404).send("Room Not Found!!");
});

app.post("/create",(req,res)=>{

    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    const roomName = req.query.name;
    if(db.hasOwnProperty(roomName)){
        return res.status(409).send("Room already exists!!");
    }

    if(!roomName){
        return res.status(400).send("Room name can't be empty!!");
    }

    if(roomName.length < 1){
        return res.status(400).send("Room name can't be empty!!");
    }
    
    db[`${roomName}`] = {
        "messages":[]
    };

    return res.status(200).json({message:"Room created!!"});
});
io.on('connection',(socket) =>{
    console.log('user connected!!');

    socket.on('message', (msg) =>{
        console.log("Message Received:",msg);       // Remove excess logging later for production
        db[msg.roomName].messages.push(msg);
        //socket.broadcast.emit('message',msg);
        socket.to(msg.roomName).emit("message",msg);
    });

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        // Retrieve message history from Redis and emit to user
        // client.HGET(`room:${roomName}`, 'messages', (err, messages) => {
        //   if (err) {
        //     console.error(err);
        //     return;
        //   }
        //   socket.emit('messages', JSON.parse(messages) || []);
        // });
        console.log("Socket room Connected!!");
    });
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    //socket.emit('chat-message','Hello world')
})