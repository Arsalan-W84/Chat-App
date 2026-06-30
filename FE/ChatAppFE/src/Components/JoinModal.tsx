import { useState } from "react";
import { usemodalstore, useSocketStore } from "../store";


export function JoinModal() {
  //const toggleCreateRoom = usemodalstore((state) => state.toggleCreateRoom);
  const Socket = useSocketStore((state) => state.Socket);
  const toggleJoinRoom = usemodalstore((state) => state.toggleJoinRoom);
  const [roomId, setRoomId] = useState("");
  
  const handleSubmit = (e : any) => {
    e.preventDefault();
    if (roomId.trim()) {
      // Add your API or Socket join logic here
      const joinrequest = {
        type : "join" , 
        payload : {
            roomId : roomId.trim()
        }
      }
      Socket?.send(JSON.stringify(joinrequest));
      console.log("Joining room:", roomId.trim());
      
      // Close the modal after joining
      toggleJoinRoom(); 
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-sm p-6 bg-gray-600 rounded-xl shadow-2xl">
        <h2 className="mb-4 text-white text-xl font-bold text-gray-800">Join Room</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Enter Room ID"
            className="w-full px-4 py-2 mb-6 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />

          <div className="flex justify-end gap-3">
            <button
                type="button" onClick={toggleJoinRoom}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >Cancel 
            </button>
            <button type="submit" disabled={roomId.length !=8}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Join
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}