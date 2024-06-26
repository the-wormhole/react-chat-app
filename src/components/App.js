import './styles/App.css';
import Chat from './Chat.js';
import {useState,useEffect} from 'react'
import { Link, useNavigate, Outlet } from "react-router-dom";
import Cookies from 'js-cookie';

function Home(){
  return (
    <div className='container'>
      <span className='size'>Welcome to the Gossip Engine 😈</span>

      <section id='menu'>
        <Link to="/create">        
          <button>
            Create Chat
          </button>
        </Link>

        <Link to="/join">        
          <button>
            Join Chat
          </button>
        </Link>
      </section>
    </div>
  );
}


export function CreateChat(){

  // Math.random()*100000
  const [cname,setCname] = useState("");
  const [uname,setUname] = useState("");
  const navigate = useNavigate();

  function create(event){
  
    event.preventDefault();
    //console.log(event);
    if(!cname || !uname){
      console.log(cname);
      console.log(uname)
      window.alert(`Chat Name and User Name both are required!!`);
      return;
    }
  
    //make request to Server to create chat
    const opts = {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      //body:JSON.stringify({Gquery})
    };

    fetch(`http://localhost:5000/create?name=${cname}`,opts)
    .then((res) =>{
      if(!res.ok) {
          throw new Error(`Network response was not ok (${res.status}):${res.statusText}`); // Throw error for non-2xx responses
        }
      return res.json(); // Parse JSON if successful
    })
    .then((room) => {
      //console.log(room);
      //alert(`Room ${cname} created!!`)
      alert(room);
    })
    .catch(err => console.log(err));

    Cookies.set('user',uname);
    Cookies.set('roomName',cname);
    //window.alert(`${cname} was create by user - ${uname}`);
    
    setTimeout(() =>{
      navigate('/chat');
    },2000)
    
  }

  return(
    <div className='container'>
      <h1>Create</h1>
      <form onSubmit={create} className='form-style'>

        <input 
          id='cname'
          name='cname'
          type="text" 
          value={cname}
          placeholder='Chat Name'
          onChange={(e) =>{setCname(e.target.value)}}
          required 
          />

        <input 
          id='uname' 
          name='uname' 
          type="text"
          value={uname}
          placeholder='User Name'
          required
          onChange={(e) =>{setUname(e.target.value)}}
          />
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export function JoinChat(){

  const [cname,setCname] = useState("");
  const [uname,setUname] = useState("");
  const navigate = useNavigate();

  const join = (event) =>{
    event.preventDefault();

    if(!cname || !uname){
      console.log(cname);
      console.log(uname)
      window.alert(`Chat Name and User Name both are required!!`);
      return;
    }

    Cookies.set('user',uname);
    Cookies.set('roomName',cname);

    alert(`Joining the chat:${cname} as the user ${uname}`);
    navigate('/chat');
  }
  return (
    <div className='container'>

      <h1>Join chat</h1>
      <form onSubmit={join} className='form-style'>

        <input 
          id='cname'
          name='cname'
          type="text" 
          value={cname}
          placeholder='Chat Name'
          onChange={(e) =>{setCname(e.target.value)}}
          required 
          />

        <input 
          id='uname' 
          name='uname' 
          type="text"
          value={uname}
          placeholder='User Name'
          required
          onChange={(e) =>{setUname(e.target.value)}}
          />
        <button type='submit'>Join</button>
      </form>
    </div>
  )
}

export function ChatApp(){

  return <Chat/>;
}

export function App() {
  //setTimeout(3000);
  return <Home/>;
}

