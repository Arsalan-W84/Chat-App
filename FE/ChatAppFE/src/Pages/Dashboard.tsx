import {useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, type Room } from "../Components/Sidebar";
import { Chatbox } from "../Components/Chatbox";
import { useMessageStore, usemodalstore, useRoomStore, useSocketStore, useUserStore, type User } from "../store";
import { JoinModal } from "../Components/JoinModal";

export function Dashboard() {

  const SetMessages = useMessageStore((state) => state.SetMessages );
  const addMessage = useMessageStore((state) => state.addMessage );
  //const Messages = useMessageStore((state) => state.Messages );
  const setSocket = useSocketStore((state) => state.SetSocket);

  const navigate = useNavigate();
  const Rooms = useRoomStore((state) => state.Rooms);
  const SetRooms = useRoomStore((state) => state.SetRooms);
  const addRoom = useRoomStore((state) => state.AddRoom);

  const SetUser = useUserStore((state) => state.SetUser);

  // create/join/leave room modals
  const JoinRoom = usemodalstore((state) => state.JoinRoom);
  //const CreateRoom = usemodalstore((state) => state.CreateRoom);
  //const LeaveRoom = usemodalstore((state) => state.LeaveRoom);
  const SetCurrentRoomId = useRoomStore((state) => state.SetCurrentRoomId);

  


  //upon login in all rooms of the user will be displayed on the left sidebar
  useEffect(() => {
    if(localStorage.getItem("token") === null ){
      alert("Session Expired ! Log in to continue .");
      //navigte to landing page
      navigate("/");
    }
    const ws = new WebSocket("ws://localhost:8080?token=" + localStorage.getItem('token'));
    setSocket(ws);   
    ws.onopen = () => {
        console.log("Connected!");
        const jsondata ={
          type : "rooms"
        }
        const stringdata = JSON.stringify(jsondata);
        console.log("Request sent");
        ws.send(stringdata);
    }
        
    // all rooms of the user comes from the server
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if(data.type === 'rooms'){
          SetRooms(data.payload);
          //console.log(data.payload[0].userId); 
          const user : User = {
            _id : data.payload[0].userId._id ,
            username : data.payload[0].userId.username
          }
          SetUser(user);
      }
      else if(data.type === 'history'){
          SetMessages(data.payload);
      }else if(data.type === 'message') {
          addMessage(data.payload);
          //console.log(data.payload);
      }else if(data.type === 'join'){
          if(!data.error){
            addRoom(data.payload);
            console.log(data.payload);
            SetCurrentRoomId(data.payload.roomId);
          }else{
            alert(data.error);
            return;
          }
      }else if(data.type === 'create'){
          if(!data.error){
            addRoom(data.payload);
            console.log(data.payload);
            SetCurrentRoomId(data.payload.roomId);
          }else{
            alert(data.error);
            return;
          }
      }
    }
    ws.onerror = (e) => {
      console.log("Websocket error : " + e);
    }

    //cleanup
    return () => {
      ws.close();
    }

  } , []);
  
  

  return(
    <div className="flex ">
      {JoinRoom && <JoinModal />}
      <Sidebar Rooms ={Rooms} />
      <Chatbox  />
    </div>
  );
}
