import { WebSocketServer, WebSocket } from 'ws';
import { MembershipModel, MessageModel, UserModel } from './db.js';
import mongoose from 'mongoose';
const wss = new WebSocketServer({ port: 8080 });
let Roomsockets = new Map();
await mongoose.connect("mongodb+srv://arsalanwahid0804_db_user:C5S9Z6oTDJ2r3y5H@cluster0.mckhh0n.mongodb.net/ChatApp");
console.log("DB connected");
wss.on('connection', (Socket) => {
    console.log("Socket connected");
    Socket.on('error', console.error);
    Socket.on('message', async (message) => {
        const data = JSON.parse(message);
        if (data.type === 'join') { //user wants to join the server
            console.log("Join Request Sent");
            //make an entry into the Allsockets map
            let sockets = Roomsockets.get(data.payload.roomId);
            if (!sockets) {
                sockets = new Set();
                Roomsockets.set(data.payload.roomId, sockets);
            }
            sockets?.add(Socket);
            //make an entry when a user joins a group
            // await MembershipModel.create({
            //     userId : data.payload.userId,
            //     roomId : data.payload.roomId,
            //     role : "member",
            //     joinedAt : Date.now()
            // });
            console.log("User now part of room : " + data.payload.roomId);
            //return all the previous chats of this room to this user
            // const messages = await MessageModel.find({
            //     roomId : data.payload.roomId
            // }).sort({ sentAt : 1});
            // Socket.send(JSON.stringify(messages));
        }
        else if (data.type === 'message') { // user sent a message in a room
            //enter the message into the DataBase
            // await MessageModel.create({
            //     sender : data.payload.sender,
            //     roomId : data.payload.roomId,
            //     content : data.payload.content,
            //     sentAt  : data.payload.sentAt 
            // });
            const message = JSON.stringify(data.payload);
            console.log(message);
            //iterate over Allsockets to send the messages using their sockets 
            let sockets = Roomsockets.get(data.payload.roomId);
            console.log(sockets);
            sockets?.forEach(s => s.send(message));
        }
    });
    Socket.on('disconnect', () => {
    });
});
//# sourceMappingURL=index.js.map