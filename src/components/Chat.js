import {useState, useEffect} from 'react'
import './styles/Chat.css'
import Cookies from "js-cookie";
// import {App} from "./App"
import io from 'socket.io-client'
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:5000');

function ChatBox(props){

    const [message,setMessage] = useState("");
    const send = (event) =>{
        event.preventDefault();
        if(message.length > 0){

            let newMessage = {
                username:Cookies.get("user"),
                text:message,
                roomName:props.roomName
            };

            if(!socket.connected){
                socket.connect(); // To re-initiate a socket connection after a user leaves a chat and reconnects later
            }

            props.addMessage(newMessage); // Call the function to update state in Chat
            socket.emit('message', newMessage);
            //socket.to(props.roomName).emit('message', newMessage);
            setMessage('');
            return;
        }
        alert("Message can not be empty!!");
    }

    return (
        <div id="form">
            <form onSubmit={send}>
                <input 
                    type="text" 
                    name="message" 
                    value ={message} 
                    placeholder="Enter a message to send" 
                    required
                    onChange={(event)=>{setMessage(event.target.value)}}/>
                <button type = "submit">Enter</button>
            </form>
        </div>
    )
}

function Messages(props){

    var ctr = 0;
    let username = Cookies.get("user");
    return(
        <ul type="none" id='messages'>
            {props.messageStore.map((message) => {
                
                if(username && message.username === username){
                    return (<li key = {ctr++} className="sent">{username}:{message.text}</li>);
                }
                return (<li key = {ctr++} className="received">{message.username}:{message.text}</li>);
            })}
        </ul>
    )
}

function Chat(){

    const [messageStore, setMessageStore] = useState([{username:"user1",text:"hello"}, {username:"user2",text:"Hey"}]);
    const [loading,setLoading] = useState(false);
    const [roomName,setroomName] = useState(Cookies.get("roomName"));
    //useState(roomMessages.messages);

    const opts = {
        method:"GET",
        headers:{"Content-Type":"application/json"},
        //body:JSON.stringify({Gquery})
      };
    
    //console.log(messageStore);
    //console.log(messages);

    const addMessage = (newMessage) => {
      setMessageStore((prevMessages) => [...prevMessages, newMessage]); // Create a new array
    };

    useEffect(() =>{
        let username = Cookies.get("user");
        const name = roomName;
        setLoading(true);

        fetch(`http://localhost:5000/join?name=${name}`,opts)
        .then((res) =>{
            if(!res.ok) {
                throw new Error(`Network response was not ok (${res.status}):${res.statusText}`); // Throw error for non-2xx responses
              }
            return res.json(); // Parse JSON if successful
        })
        .then((messages) =>{
            
            console.log(messages);
            alert(`Room ${roomName} joined!!`)
            socket.emit("joinRoom",roomName);

            setMessageStore(messages.messages)
        })
        .then(() => setLoading(false))
        .catch((err) => {

            Cookies.remove("user");
            Cookies.remove("roomName");
            setroomName("");
            socket.disconnect();
            //console.log(err);
            alert(`Error ${err.message}`)
            navigate('/');
            
        });

        if(!username){          // Checking if the user cookie is set
            alert("Username is required to join the chat!!");
            navigate('/');
        }
        socket.on('message',(msg) => {
            addMessage(msg);
        });

        return () => {
            // Cleanup function when component unmounts
            socket.disconnect();
          };
    },[]);

    const navigate = useNavigate();

    const leave = () => {
        Cookies.remove("user");
        Cookies.remove("roomName");
        setroomName("");
        socket.disconnect();
        navigate('/');
    };
    if(loading){
        return(
            <h1>Loading...</h1>
        )
    }else{
        return (
            <div className='container'>
                <div id="chat-name">
                    <h1>{roomName}</h1>
                    <button id='leave' onClick={leave}>Leave Chat</button>
                </div>
                <Messages messageStore={messageStore}/>
                <ChatBox addMessage={addMessage} roomName={roomName}/>
            </div>
        )
    }
}



export default Chat