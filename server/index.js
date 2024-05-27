const express = require('express');
const app = express();
const http = require("http").createServer(app);
//const db = require("./_db");    //replace with Redis
const cors = require("cors");
const redisClient = require('./redis-config');
const io = require("socket.io")(http,{
    cors:{
        origin:"http://localhost:3000",
    },
});

app.use(cors());

http.listen(5000,() => {
    console.log("Server running at port 5000!!")
})

app.get("/join", async(req,res)=>{
    try{
        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        });
        const roomName = req.query.name;

        if(!roomName){
            return res.status(400).json({message:"Room name can't be empty!!"});
        }

        if(roomName.length < 1){
            return res.status(400).json({message:"Room name can't be empty!!"});
        }

        if(await redisClient.hExists(`rooms:${roomName}`,'messages')){

            //return res.status(200).json(db[roomName]);
            var messageArr = await redisClient.hGet(`rooms:${roomName}`,'messages')
            var messages = JSON.parse(messageArr); //Converts JSON array string to JSON array object

            return res.status(200).json({messages:messages});

        }
        // if(db.hasOwnProperty(roomName)){
        //     //console.log(db[roomName]);
        //     return res.status(200).json(db[roomName]);
        // }
        res.status(404).json({message:"Room Not Found!!"});
    }catch(err){
        console.log("Encountered an error while joining a chat!!",err);
    }
});

app.post("/create",async(req,res)=>{
    try{
        res.set({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        });
        const roomName = req.query.name;
        // if(redisClient.hExists(`rooms:${roomName}`,'messages')){
        //     return res.status(409).send("Room already exists!!");
        // }
        if(!roomName){
            return res.status(400).json({message:"Room name can't be empty!!"});
        }

        if(roomName.length < 1){
            return res.status(400).json({message:"Room name can't be empty!!"});
        }

        var roomExists = await redisClient.HEXISTS(`rooms:${roomName}`, 'messages');

        console.log(roomExists);
        if(roomExists){
            
            return res.status(409).json({message:"Room already exists!!"});

        }else{

            await redisClient.hSet(`rooms:${roomName}`, 'messages','[]');
            // db[`${roomName}`] = {
            //     "messages":[]
            // };
            return res.status(200).json({message:"Room created!!"});
        }
    }catch(err){
        console.log("Error while creating a Room -",err);
    }
});
io.on('connection',async(socket) =>{
    try{
        console.log('user connected!!');

        socket.on('message', async(msg) =>{
            console.log("Message Received:",msg);       // Remove excess logging later for production

            socket.to(msg.roomName).emit("message",msg); //First emit the message then updating it in database

            var messageArr = await redisClient.hGet(`rooms:${msg.roomName}`,'messages');
            var messages = JSON.parse(messageArr);
            messages.push(msg);
            await redisClient.hSet(`rooms:${msg.roomName}`,'messages',JSON.stringify(messages));
            //db[msg.roomName].messages.push(msg);
            //socket.broadcast.emit('message',msg);
            //socket.to(msg.roomName).emit("message",msg);
        });

        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
            console.log("Socket room Connected!!");
        });
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    //socket.emit('chat-message','Hello world')
    }catch(err){
        console.log("Encoutered and error with websockets!!",err);
    }
})