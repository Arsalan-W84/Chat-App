import { useRoomStore } from "../store";

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

    return (
        <div className="w-[30%] h-screen bg-gray-600 overflow-y-auto border border-gray-400">
            <div className="flex justify-between">
                <button className="m-2 p-3 bg-blue-300">Create Room </button>
                <button className="m-2 p-3 bg-blue-300"> Join A Room</button>
            </div>
            <div className="m-1 ml-3 text-white text-2xl">
                Chats
            </div>
            {
                Rooms.map(room => (<div key={room._id} onClick={()=>{SetCurrentRoomId(room.roomId)}} className="m-1 p-3 bg-gray-500 text-white border rounded-2xl">
                    {room.roomId} 
                </div>
            ))}
        </div>
    );
}