import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = process.env.MONGO_URL;
import { WebSocketServer, WebSocket } from 'ws';
import { MembershipModel, MessageModel, UserModel } from './db.js';
import mongoose from 'mongoose';
const wss = new WebSocketServer({ port: 8080 });
let Roomsockets = new Map();
await mongoose.connect(MONGO_URL);
console.log("DB connected");
wss.on('connection', (Socket) => {
    console.log("Socket connected");
    Socket.on('error', console.error);
    Socket.on('message', async (message) => {
        const data = JSON.parse(message);
        if (data.type === 'join') { //user wants to join the server
            console.log("Join Request Sent");
            //make an entry into the RoomSockets map
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
            //????????ENTER MESSAGE INTO THE DATABASE ??????
            const message = JSON.stringify(data.payload);
            console.log(message);
            //?????????????HOW WILL YOU VERIFY DATA , WHICH USER SENDS ???
            //iterate over Allsockets to send the messages using their sockets 
            //  Roomsockets : {
            //       room1: {user1,user2,user3....},
            //       room2: {user2,user4,user5,.......}
            //  }
            let sockets = Roomsockets.get(data.payload.roomId);
            console.log(sockets);
            sockets?.forEach(s => s.send(message));
        }
    });
    Socket.on('disconnect', () => {
    });
});
//# sourceMappingURL=index.js.map