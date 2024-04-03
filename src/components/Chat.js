import {useState} from 'react'
import './styles/Chat.css'
import Cookies from "js-cookie";
// import {App} from "./App"
import { useNavigate } from 'react-router-dom';

function ChatBox(props){

    const [message,setMessage] = useState("");
    const send = (event) =>{
        event.preventDefault();
        if(message.length > 0){

            let newMessage = {
                username:Cookies.get("user"),
                text:message
            };

            props.addMessage(newMessage); // Call the function to update state in Chat
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
    return(
        <ul type="none" id='messages'>
            {/* {messageStore.forEach((message)=>{
                    <li>Username:{message}</li>
            })} */}
            {props.messageStore.map((message) => {
                let username = Cookies.get("user");
                if(message.username === username){
                    return (<li key = {ctr++} className="sent">{username}:{message.text}</li>);
                }
                return (<li key = {ctr++} className="received">{message.username}:{message.text}</li>);
            })}
            {/* props.messageStore.indexOf(message) */}
            {/* <li>hey</li> */}
        </ul>
    )
}

function Chat(){

    const [messageStore, setMessageStore] = useState([{username:"user1",text:"hello"}, {username:"user2",text:"Hey"}]);

    const addMessage = (newMessage) => {
      setMessageStore((prevMessages) => [...prevMessages, newMessage]); // Create a new array
    };
    const navigate = useNavigate();

    const leave = () => {
        Cookies.remove("user");
        navigate('/');
    };

    return (
        <div className='container'>
            <div id="chat-name">
                <h1>Chat Name</h1>
                <button id='leave' onClick={leave}>Leave Chat</button>
            </div>
            <Messages messageStore={messageStore}/>
            <ChatBox addMessage={addMessage}/>
        </div>
    )
}



export default Chat