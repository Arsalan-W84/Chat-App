
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  //chat messages ref
  const [list, setList] = useState<string[]>([]);
  const Socketref = useRef(null);
  useEffect(()=>{
    const Socket = new WebSocket("ws://localhost:8080"); 
    //@ts-ignore 
    Socketref.current = Socket;

    Socket.onopen = () => {};
    Socket.onmessage = (event) => {
        //const data = JSON.parse(event.data);
        const data = event.data;
        setList(prev => [...prev , data]);
    };
    Socket.onerror = () => {};
    Socket.onclose = () => {};

    
  } ,[]);

  const InputBoxRef = useRef(null);

  function sendMessage() {
      //@ts-ignore
      Socketref.current.send(InputBoxRef.current.value);
  }
  return (
    <div className='w-screen h-screen bg-[#012938] flex justify-center items-center'>
        <div className='p-4 w-110 h-110 bg-[#013748] border-xl rounded-2xl'>
            <div className='p-2 h-[90%] bg-red-400'>
                  {list.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
            </div>

            <div className='p-2 mt-1 flex items-center bg-blue-300'>
                <div className=''>
                  <input ref={InputBoxRef} placeholder='message...'></input>
                </div>
                <div>
                  <button onClick={sendMessage} className='bg-blue-700'>Send</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App
