
import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  //chat messages ref

  //ref to take inputbox string
  const InputBoxRef = useRef(null);

  function onClickHandler() {//after send button is clicked
      
  }
  return (
    <div className='w-screen h-screen bg-[#012938] flex justify-center items-center'>
        <div className='p-4 w-110 h-110 bg-[#013748] border-xl rounded-2xl flex flex-col'>
            <div className='p-2 h-[90%] bg-red-400'>
              
            </div>

            <div className='mt-2 flex justify-between'>
                <div className='m-1 w-[80%] bg-blue-500 rounded-3xl'>
                  <input ref={InputBoxRef} placeholder='message...' className='p-3 w-full outline-none text-white'></input>
                </div>
                <div className='m-1'>
                  <button onClick={onClickHandler} className='p-3 bg-blue-500 hover:bg-blue-600 rounded-3xl'>Send</button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default App
