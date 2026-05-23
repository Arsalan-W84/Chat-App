export function Dashboard() {

  
  const setSocket = useSocketStore((state) => state.SetSocket);

  const navigate = useNavigate();
  const Rooms = useRoomStore((state) => state.Rooms);
  const SetRooms = useRoomStore((state) => state.SetRooms);

  //upon login in all rooms of the user will be displayed on the left sidebar
  useEffect(() => {
    if(localStorage.getItem("token") === null ){
      alert("UNAUTHORIZED! PLEASE LOGIN");
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
      SetRooms(data);
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
      <Sidebar Rooms ={Rooms} />
      <Chatbox  />
        </div>
    );
}