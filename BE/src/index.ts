import dotenv from 'dotenv';
dotenv.config();
const MONGO_URL = process.env.MONGO_URL as string;

import {WebSocketServer , WebSocket} from 'ws';
import  express  from 'express';
const app = express();

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { MembershipModel, MessageModel, UserModel } from './db.js';
import mongoose from 'mongoose';



//---------------AUTH ENDPOINTS-----------------
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ error: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            username,
            password: hashedPassword
        });
        return res.status(200).json({
            message : "User signed up !"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/signin" , async(req , res) => {
    const  username = req.body.username;
    const password = req.body.password;
    try{
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ 
                error: "Invalid credentials" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                error: "Invalid credentials" 
            });
        }

        const token = jwt.sign({
                userId: user._id 
            },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );
        return res.status(200).json({ token });
    } catch(e){
        return res.status(500).json({
            e
        })
    }
    
});
//---------------------------------------------
await mongoose.connect(MONGO_URL);
console.log("DB connected");

const wss = new  WebSocketServer({port : 8080});
let Roomsockets  = new Map< string , Set<WebSocket>> () ; 

wss.on('connection' , (Socket , req) => {
    //add the token to the Socket
    const url = new URL(req.url!, "http://localhost");
    const token = url.searchParams.get("token");
    try{
        const decoded = jwt.verify(token! , process.env.JWT_SECRET!);
        (Socket as any).userId = (decoded as any).userId;
        
    }catch(e){
        Socket.send("Unauthoried");
        Socket.close();
        return ;
    }
    console.log("Socket connected");

    Socket.on('error' , console.error);
    Socket.on('message' , async (message : string) => { //message sent to server 
        let data;
        try {
            data = JSON.parse(message.toString());
        } catch {
            return;
        }

       if(data.type === 'join') { //user wants to join the server
            try{
                //get all sockets of this roomId from RoomSockets map
                let sockets = Roomsockets.get( data.payload.roomId );

                //if this roomId is not present , socket will be empty
                if(!sockets){
                    Socket.send("This room does not exist!!");   
                }
                //if the socket is already present in the set 
                else if(sockets?.has(Socket)){
                    Socket.send("User is already part of this room");
                }
                else{//room is present and user was not previously present
                    sockets?.add(Socket);
                    //make an entry when a user joins a group
                    await MembershipModel.findOneAndUpdate(
                        {
                        userId : (Socket as any).userId,
                        roomId : data.payload.roomId,
                        } , 
                        {
                            $setOnInsert : {
                                role : "member",
                                joinedAt : Date.now()
                            }
                        },
                        {
                            upsert : true
                    });
                    Socket.send("Joined Room : " + data.payload.roomId);
                    console.log("User now part of room : " + data.payload.roomId);
                }
                
                
            }
            catch(e){
                console.log(e);
            }
            //return all the previous chats of this room to this user ????

        } else if(data.type === 'create') { // user wants to create a room
            //create a roomId
            const list = ['1','2','3','4','5','6','7','8','9','a','b','c','d','e','i','o','u'];
            let n= list.length;
            let uid = "";
            for(let i=0;i<8;i++){
                uid+=list[Math.floor(Math.random()*n)];
            }
            //make an entry in Roomsockets with this new room 
            let s = new Set<WebSocket> ();
            s.add(Socket);
            Roomsockets.set(uid , s);
            try{
                //make an entry with this user and room   
                await MembershipModel.create({
                    userId : (Socket as any).userId,
                    roomId : uid,
                    role : "admin",
                    joinedAt : Date.now()
                });

                //for loggin the name and roomId  
                const user = await UserModel.findOne({
                    _id : (Socket as any).userId
                });
                Socket.send("Room Id : " + uid);
                console.log("Room :" + uid + " created by user : " + user?.username);
            }catch(e){
                console.log("errror :  " + e);
            }
            
        } else if(data.type === 'leave') { // user wants to leave a room
        
                try{
                    //find the room which user wants to leave
                    let sockets = Roomsockets.get(data.payload.roomId);
                    console.log("2");
                    if(!sockets){
                        Socket.send("Room : " + data.payload.roomId +"doesn't exist");
                        
                    }else{

                        const deleted = sockets?.delete(Socket);
                        if(deleted){
                            if(sockets?.size == 0){ //no other member in this room
                                Roomsockets.delete(data.payload.roomId);
                                console.log("Deleted room : " + data.payload.roomId);
                            }else{
                                //@ts-ignore
                                Roomsockets.set(data.payload.roomId , sockets);
                            }
                            
                            //delete the entry from the relationship 
                            await MembershipModel.findOneAndDelete({
                                userId : (Socket as any).userId , 
                                roomId : data.payload.roomId
                            });
                            
                            //for loggin the name and roomId  
                            const user = await UserModel.findOne({
                                _id : (Socket as any).userId
                            });
                            
                            Socket.send("User: " + user + " , left the Room: " + data.payload.roomId);
                            console.log("User: " + user?.username  + " left the room : " + data.payload.roomId);
                        
                        }else { //Socket is not part of this room
                            Socket.send("Could not delete user from room : " + data.payload.roomId)
                        }
                    }
                    
                }catch(e){
                    console.log(e);
                }
        } else if(data.type === 'message') { // user sent a message in a room

            //first check if user is part of this room or not
            const sockets = Roomsockets.get(data.payload.roomId);
            if(!sockets){
                Socket.send("Room does not exist!");
            }
            const userfoundinroom = sockets?.has(Socket);
            if(userfoundinroom === false){
                Socket.send("User not a part of this room .")
            }
            //enter message into the Database
            const saved = await MessageModel.create({
                sender: (Socket as any).userId,
                roomId: data.payload.roomId,
                content: data.payload.content,
                sentAt: Date.now()
            });

            const message = JSON.stringify({
                type : "message" , 
                payload : saved
            });
            console.log(message);
            
            sockets?.forEach(s=> s.send(message));
        }

    });

    Socket.on("close", () => {
        Roomsockets.forEach((set, roomId) => {
            if (set.has(Socket)) {
                set.delete(Socket);

                if (set.size === 0) {
                    Roomsockets.delete(roomId);
                }
            }
        });
    });

});

app.listen(3000);

