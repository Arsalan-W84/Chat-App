import {WebSocketServer , WebSocket} from 'ws'

const wss = new  WebSocketServer({port : 8080});

let Allsockets : WebSocket[] = [] ; 

wss.on('connection' , (Socket) => {
    Allsockets.push(Socket);

    Socket.on('error' , console.error);

    Socket.on('message' , (message) => { //message sent to server 
        console.log(message.toString());
        //sending the message to all the users(sockets)
        Allsockets.map(s => {
            s.send(message.toString());
        });
        //Socket.send(message.toString() + ":sent from the server")
    });

    //if connection closes for a user , we should delete his socket
    Socket.on('disconnect' , ()=>{
        Allsockets = Allsockets.filter(x => x!=Socket);
    });
    Socket.send("HI there");
})