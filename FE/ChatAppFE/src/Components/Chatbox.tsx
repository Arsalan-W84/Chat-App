import { useEffect, useRef, useState } from 'react'
import { useMessageStore, useRoomStore, useSocketStore, useUserStore } from '../store';

export function Chatbox() {

    const Socket = useSocketStore((state) => state.Socket);
    const CurrentRoomId = useRoomStore((state) => state.CurrentRoomId);
    const Messages = useMessageStore((state) => state.Messages);
    const User = useUserStore((state) => state.User);
   //ref to take inputbox string
    const InputBoxRef = useRef<HTMLInputElement>(null); 

    function onClickHandler() {//after send button is clicked
        if(!InputBoxRef.current?.value) {
            return;
        }
       //convert to valid JSON
       const jsondata = {
        type : "message",
        payload : {
            roomId : CurrentRoomId,
            content: InputBoxRef.current?.value 
        }

       }
      
      const stringdata = JSON.stringify(jsondata);
      //@ts-ignore
      Socket.send(stringdata);
       //clear the input field
      if(InputBoxRef.current){
          InputBoxRef.current.value = '';
      }
     
    }

    //how to always scroll to bottom ? Use a invisible div make control always point there
    const bottomRef = useRef<HTMLDivElement> (null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });//behaviour : smooth means smoothly scroll down
    }, [Messages]);
    //------------------

    //fetch current room messages 
    useEffect(()=>{
        const message = JSON.stringify({
            type : "history",
            payload : {
                roomId : CurrentRoomId
            }
        });
        Socket?.send(message);
        
    } , [CurrentRoomId]);
    //--------------------

   return (
    
    <div className=' w-[70%] h-screen bg-[#012938] flex justify-center items-center'>
        <div className='p-4 w-full h-full bg-[#013748] border-xl  flex flex-col'>
            <div className='p-2 h-[90%] bg-gray-600  rounded-2xl text-white overflow-y-auto'>
              {
                    
                  Messages.map((m,i) => 
                  <div key={i} className= {`m-1 p-1 flex ${(m.sender != User?._id)? "justify-end" : ""}`}>
                    
                    <span className='p-2 bg-blue-300 rounded-xl max-w-[75%] break-words w-fit'>
                        {m.content}
                    </span>
                  </div>)
              }
              <div ref={bottomRef} />
            </div>

            <div className='mt-2 flex justify-between'>
                <div className='m-1 w-[80%] bg-gray-800 rounded-3xl'>
                  <input ref={InputBoxRef} placeholder='message...' className='p-3 w-full outline-none text-white'></input>
                </div>
                <div className='m-1'>
                  <button onClick={onClickHandler} disabled={InputBoxRef.current?.value == null} className='p-3 bg-blue-500 hover:bg-blue-600 rounded-3xl text-white'>Send</button>
                </div>
            </div>
        </div>
    </div>
    )
}
