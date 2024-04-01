import {useState} from 'react'
import './styles/Chat.css'

function Chat(){

    const [message,setMessage] = useState("");
    return (
        <div className='container'>
            <div id="chat-name">
                <h1>Chat Name</h1>
            </div>
            <div id="form">
                <form>
                    <input type="text" name="message" value ="" placeholder="Enter a message to send"></input>
                    <button type = "submit">Enter</button>
                </form>
            </div>
        </div>
    )
}

export default Chat