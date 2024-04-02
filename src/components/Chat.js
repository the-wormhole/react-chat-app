import {useState} from 'react'
import './styles/Chat.css'

function ChatBox(props){

    const [message,setMessage] = useState("");
    const send = (event) =>{
        event.preventDefault();
        if(message.length > 0){
            props.addMessage(message); // Call the function to update state in Chat
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
            {props.messageStore.map(message => (<li key = {ctr++} className="sent">Username:{message}</li>))}
            {/* props.messageStore.indexOf(message) */}
            {/* <li>hey</li> */}
        </ul>
    )
}

function Chat(){

    const [messageStore, setMessageStore] = useState(["hello", "Hey"]);

    const addMessage = (newMessage) => {
      setMessageStore((prevMessages) => [...prevMessages, newMessage]); // Create a new array
    };

    return (
        <div className='container'>
            <div id="chat-name">
                <h1>Chat Name</h1>
            </div>
            <Messages messageStore={messageStore}/>
            <ChatBox addMessage={addMessage}/>
        </div>
    )
}



export default Chat