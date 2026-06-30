import { usemodalstore, useRoomStore, useUserStore } from "../store";

export interface Room {
    _id : string, 
    userId : string,
    roomId : string,
    joinedAt : Date,
    role : "member" | "admin"
}
interface Sidebarprops {
    Rooms : Room[]
}
export function Sidebar({Rooms} : Sidebarprops) {
    const SetCurrentRoomId = useRoomStore((state) => state.SetCurrentRoomId);
    const User = useUserStore((state) => state.User);
    const toggleCreateRoom = usemodalstore((state) => state.toggleCreateRoom);
    const toggleJoinRoom = usemodalstore((state) => state.toggleJoinRoom);


    return (
        <div className="w-[30%] h-screen bg-gray-600 overflow-y-auto border border-gray-400">
            <div className="p-2 text-white text-2xl text-bold"> Welcome Back {User?.username} </div>
            <div className="flex justify-between">
                <button onClick={toggleCreateRoom} className="m-2 p-3 bg-blue-300">Create Room </button>
                <button onClick={toggleJoinRoom} className="m-2 p-3 bg-blue-300"> Join A Room</button>
            </div>
            <div className="m-1 ml-3 text-white text-2xl">
                Your Chats
            </div>
            {
                Rooms.map(room => (<div key={room._id} onClick={()=>{SetCurrentRoomId(room.roomId)}} className="m-1 p-3 bg-gray-500 hover:bg-gray-600 hover:cursor-pointer text-white border rounded-2xl">
                    {room.roomId} 
                </div>
            ))}
        </div>
    );
}