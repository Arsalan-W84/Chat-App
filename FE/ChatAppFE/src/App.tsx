
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  // Global array of messages
  const [Messages , SetMessages] = useState <string[]> ([]);

  //ref to take inputbox string
  const InputBoxRef = useRef<HTMLInputElement>(null);
  const Socketref = useRef<WebSocket> (null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    Socketref.current = ws;  
    ws.onopen = () => {
      console.log("Connected!");
      const jsondata ={
        type : "join",
        payload : {
          roomId : "123123"
        }
      }
      const stringdata = JSON.stringify(jsondata);
      ws.send(stringdata);
    }
    
    //whenver a message comes from a server
    ws.onmessage = (event) => {
      SetMessages((prev) => [...prev , event.data]);        
    }

    //cleanup
    return () => {
      ws.close();
    }
  } , []);
    
  function onClickHandler() {//after send button is clicked
      //convert to valid JSON
      const jsondata ={
        type : "message",
        payload : {
          roomId : "123123",
          content: InputBoxRef.current?.value 
        }
      }
      
      //clear the input field
      const stringdata = JSON.stringify(jsondata);
      Socketref.current?.send(stringdata);
      if(InputBoxRef.current){
          InputBoxRef.current.value = '';
      }
     
  }
  
  //how to always scroll to bottom ? Use a invisible div make control always point there
  const bottomRef = useRef<HTMLDivElement> (null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });//behaviour : smooth means smoothly scroll down
  }, [Messages]);

  return (
    <div className='w-screen h-screen bg-[#012938] flex justify-center items-center'>
        <div className='p-4 w-110 h-110 bg-[#013748] border-xl rounded-2xl flex flex-col'>
            <div className='p-2 h-[90%] bg-red-400 text-white overflow-y-auto'>
              {
                  Messages.map((m,i) => 
                  <div key={i} className='m-1 p-2 '>
                      <span className='p-2 bg-blue-300 rounded-xl'>
                        {JSON.parse(m).content}
                      </span>
                  </div>)
              }
              <div ref={bottomRef} />
            </div>

            <div className='mt-2 flex justify-between'>
                <div className='m-1 w-[80%] bg-blue-500 rounded-3xl'>
                  <input ref={InputBoxRef} placeholder='message...' className='p-3 w-full outline-none text-white'></input>
                </div>
                <div className='m-1'>
                  <button onClick={onClickHandler} className='p-3 bg-blue-500 hover:bg-blue-600 rounded-3xl text-white'>Send</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App
