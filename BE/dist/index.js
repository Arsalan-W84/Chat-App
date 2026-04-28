import { WebSocketServer, WebSocket } from 'ws';
const wss = new WebSocketServer({ port: 8080 });
const Allsockets = [];
wss.on('connection', (Socket) => {
    Allsockets.push(Socket);
    Socket.on('error', console.error);
    Socket.on('message', (message) => {
        console.log(message.toString());
        //sending the message to all the users(sockets)
        Allsockets.map(s => {
            s.send(message.toString());
        });
        //Socket.send(message.toString() + ":sent from the server")
    });
    Socket.send("HI there");
});
//# sourceMappingURL=index.js.map