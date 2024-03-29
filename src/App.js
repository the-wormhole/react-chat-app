import './App.css';
import {useState} from 'react'

function Home(){
  return (
    <div className='container'>
      <span className='size'>Welcome to the Gossip Engine 😈</span>

      <section id='menu'>
        <button>
          Create Chat
        </button>
        <button>
          Join Chat
        </button>
      </section>
    </div>
  );
}


export function CreateChat(){

  // Math.random()*100000
  const [cname,setCname] = useState("");
  const [uname,setUname] = useState("");

  function create(event){
  
    event.preventDefault();
    console.log(event);
    if(!cname || !uname){
      console.log(cname);
      console.log(uname)
      window.alert(`Chat Name and User Name both are required!!`);
      return;
    }
  
    //make request to websockets to create chat
    window.alert(`${cname} was create by user - ${uname}`);
  }

  return(
    <div>
      <h1>Create</h1>
      <form onSubmit={create}>

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

export function App() {
  //setTimeout(3000);
  return <Home/>;
}

