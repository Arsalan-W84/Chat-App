import { useEffect, useRef } from 'react'
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
        <div className='p-1 w-full h-full bg-[#013748] border-xl  flex flex-col'>
            <div className='mb-1 w-full h-[5%] text-white flex justify-between'>
                <div className='p-1'>Room Id : {CurrentRoomId} </div>
                <button className='p-1 bg-blue-500 rounded-2xl'> Leave Room </button>
            </div>
            
            <div className='p-2 h-[90%] bg-gray-600  rounded-sm text-white overflow-y-auto'>
              {
                
                Messages.map((m,i) => {
                    const isOwnMessage = (m.sender._id === User?._id);
                    const timestamp = new Date(m.sentAt).toLocaleTimeString([] , {
                        hour: '2-digit', 
                        minute: '2-digit'
                    });

                    return (
                        <div key={i} className= {`w-full flex ${isOwnMessage ? "justify-end" : ""}`}>
                            <div className={`m-1 p-2 max-w-[50%]  relative flex flex-col   ${isOwnMessage ? 'bg-blue-600 rounded-lg rounded-tr-none' : 'bg-gray-700 rounded-lg rounded-tl-none'}`}> 
                                {!isOwnMessage && (<span>
                                    {m.sender.username}
                                </span>) }

                                <div className='flex items-end gap-3'>
                                    <span className='break-words min-w-0'>{m.content}</span>
                                    <span  className='text-[11px] whitespace-nowrap shrink-0 text-gray-400 mb-[-2px] '>{timestamp}</span>
                                </div>
                            </div>
                        </div>
                    );
                })
              }
              <div ref={bottomRef} />
            </div>

            <div className='mt-2 flex justify-between '>
                <div className='m-1 w-[80%] bg-gray-800 rounded-3xl'>
                  <input ref={InputBoxRef} placeholder='message...' className='p-3 w-full outline-none text-white'></input>
                </div>
                <div className='m-1'>
                    <button className= 'mr-2 p-3 bg-blue-500 hover:bg-blue-600 rounded-3xl text-white'> Add </button>
                    
                        

                    <button onClick={onClickHandler} disabled={InputBoxRef.current?.value == null} className='p-3 bg-blue-500 hover:bg-blue-600 rounded-3xl text-white'>
                        Send
                    </button>
                </div>
            </div>
        </div>
    </div>
    )
}
