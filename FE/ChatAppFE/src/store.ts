
import { create } from "zustand";
import { type Room } from "./Components/Sidebar";


export type User = {
     _id : string , 
    username : string
}
type UserStore = { 
    User : User | null,
    SetUser : (u : User) => void 
}

export const useUserStore = create<UserStore> ((set) => ({
    User : null , 
    SetUser : (u ) => {
            set({User : u});
    }
}))
//Socket store -----------
type SocketStore = {
    Socket : WebSocket | null,
    SetSocket : (socket : WebSocket) => void
}
export const useSocketStore = create<SocketStore>((set) => ({
    Socket : null,
    SetSocket : (skt) => {
        set({Socket : skt});
    } 
}));

//Room store----------
type RoomStore = { 
    Rooms : Room[] ,
    CurrentRoomId : string,
    SetRooms : (rooms : Room[]) => void,
    SetCurrentRoomId : (roomId : string) => void
}

export const useRoomStore = create<RoomStore>((set) => ({
    Rooms : [],
    SetRooms : (rooms) => {
        set({Rooms : rooms})
    },
    CurrentRoomId : "",
    SetCurrentRoomId(roomId : string) {
        set({CurrentRoomId : roomId})
    }

}));


//message store --------
type Message = {
    sender : {
        _id : string , 
        username : string
    } ,
    roomId : string  ,
    content : string , 
    sentAt : Date
}
type MessageStore = {
    Messages : Message[],
    SetMessages : (chathistory : Message[]) => void ,
    addMessage : (m : Message) => void
}
export const useMessageStore = create<MessageStore>((set) => ({
    Messages : [] , 
    SetMessages : (chatHistory) => {
        set({Messages : [...chatHistory].reverse()}); //disply newest at the bottom
    } ,
    addMessage : (m : Message) => {
        set((state) => ({Messages : [...state.Messages , m]}));
    }
}))


