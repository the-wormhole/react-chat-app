const express = require('express');
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http,{
    cors:{
        origin:"http://localhost:3000",
    },
});

http.listen(5000,() => {
    console.log("Server running at port 5000!!")
})

io.on('connection',(socket) =>{
    console.log('user connected!!');

    socket.on('message', (msg) =>{
        console.log("Message Received:",msg);
        socket.broadcast.emit('message',msg);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
    //socket.emit('chat-message','Hello world')
})