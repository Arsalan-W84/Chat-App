import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
const MONGO_URL = process.env.MONGO_URL as string;

import {WebSocketServer , WebSocket} from 'ws';
import  express  from 'express';
const app = express();

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { MembershipModel, MessageModel, UserModel } from './db.js';
import mongoose from 'mongoose';



//---------------AUTH ENDPOINTS-----------------
app.use(cors());
app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const existingUser = await UserModel.findOne({ username });

        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
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
        res.status(500).json({ message: "Server error" });
    }
});

app.post("/signin" , async(req , res) => {
    const  username = req.body.username;
    const password = req.body.password;
    try{
        const user = await UserModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                message: "Invalid credentials" 
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
        Socket.send(JSON.stringify({error : "Unauthorized"}));
        Socket.close();
        return ;
    }
    //console.log("Socket connected");

    Socket.on('error' , console.error);

    Socket.on('message' , async (message : string) => { //message sent to server 
        let data;
        try {
            data = JSON.parse(message.toString());
        } catch {
            Socket.send(JSON.stringify({ error: "Invalid JSON format" }));
            return;
        }

       if(data.type === 'join') { //user wants to join the server
            try{
                //get all sockets of this roomId from RoomSockets map
                let sockets = Roomsockets.get( data.payload.roomId );

                //if this roomId is not present in memory, check in DB
                if(!sockets){
                    const roomExists = await MembershipModel.findOne({ roomId: data.payload.roomId });
                    if(!roomExists){
                        Socket.send(JSON.stringify({error : "This room does not exist!!"}));
                        return ;
                    }
                    //if room exists inDB and not in memory , create in memory : 
                    sockets = new Set<WebSocket> ();
                    Roomsockets.set(data.payload.roomId , sockets);
                       
                }
                //if the socket is already present in the set 
                if(sockets?.has(Socket)){
                    Socket.send(JSON.stringify({error : "User is already part of this room"}));
                    return ;
                }
                else{//room is present and user was not previously present
                    sockets?.add(Socket);
                    //make an entry when a user joins a group
                    const join_relationship = await MembershipModel.findOneAndUpdate(
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
                        }
                    );
                    const message = JSON.stringify({
                        type : "join",
                        payload : join_relationship
                    });
                    Socket.send(message);
                    console.log("User now part of room : " + data.payload.roomId);
                }
                
                
            }
            catch(e){
                console.log(e);
            }
            //return all the previous chats of this room to this user ????
            const chatHistory = await MessageModel.find({
                roomId : data.payload.roomId
            }).sort({
                sentAt : -1
            }).limit(50);

            Socket.send(JSON.stringify({
                type: "history",
                payload: chatHistory
            }));
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
                const relationship = await MembershipModel.create({
                    userId : (Socket as any).userId,
                    roomId : uid,
                    role : "admin",
                    joinedAt : Date.now()
                });

                //for loggin the name and roomId  
                const user = await UserModel.findOne({
                    _id : (Socket as any).userId
                });
                const message = JSON.stringify({
                    type : "create",
                    payload : relationship
                })
                Socket.send(message);
                console.log("Room :" + uid + " created by user : " + user?.username);
            }catch(e){
                console.log("errror :  " + e);
            }
            
        } else if(data.type === 'leave') { // user wants to leave a room
        
                try{
                    
                    //delete the entry from the relationship 
                    const relationship = await MembershipModel.findOneAndDelete({
                        userId : (Socket as any).userId , 
                        roomId : data.payload.roomId
                    });

                    //if room did not exist in DB : 
                    if(!relationship){
                        Socket.send(JSON.stringify({
                            error : "You are not part of this room!"
                        }));
                        return ;
                    }
                    //find the room in memory
                    let sockets = Roomsockets.get(data.payload.roomId);
                    if(!sockets){
                        // room did not exist locally bcz after server restart , RoomSockets becomes empty . So we deleted from DB , if it exists in memory too then we delete from there  , otherwise its fine .  
                        return;
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
                        
                            const message = JSON.stringify({
                                type : "leave",
                                payload : relationship
                            })
                            
                            Socket.send(message);
                            console.log("User left the room : " + data.payload.roomId);
                        
                        }else { //Socket is not part of this room
                            Socket.send(JSON.stringify({error : "Could not delete user from room"}));
                            return;
                        }
                    }
                    
                }catch(e){
                    console.log(e);
                }
        } else if(data.type === 'message') { // user sent a message in a room

            //first check if user is part of this room or not
            const sockets = Roomsockets.get(data.payload.roomId);
            if(!sockets){
                const roomExists = await MembershipModel.findOne({ roomId: data.payload.roomId });
                if(!roomExists){
                    Socket.send(JSON.stringify({error : "This room does not exist!!"}));
                    return ;
                }
            }
            const userfoundinroom = sockets?.has(Socket);
            if(userfoundinroom === false){
                Socket.send(JSON.stringify({error : "User not a part of this room ."}));
                return;
            }
            //enter message into the Database
            const saved = await MessageModel.create({
                sender: (Socket as any).userId,
                roomId: data.payload.roomId,
                content: data.payload.content,
                sentAt: Date.now()
            });
            await saved.populate("sender" , "_id username");
            //update memebership model , joined at to Date.now
            await MembershipModel.findOneAndUpdate(
                {
                    userId : (Socket as any).userId ,
                    roomId : data.payload.roomId
                } , {
                    $set : {
                        joinedAt : Date.now()
                    }
                }
            );
            
            
            const message = JSON.stringify({
                type : "message" , 
                payload : saved
            });
            //console.log(message);
            
            sockets?.forEach(s=> s.send(message));
        }else if(data.type === 'rooms') {// sends the room details of the user in dashboard 
           
            const userRooms = await MembershipModel.find({
                userId : (Socket as any).userId
            }).populate("userId" , "username ")
            .sort({
                joinedAt : -1 //descending order
            });
            //what if RoomSockets is empty , due to BE restart?
            userRooms.forEach( room => {
                let sockets = Roomsockets.get(room.roomId!);
                if(!sockets) {
                    sockets = new Set<WebSocket> ();
                    Roomsockets.set(room.roomId! , sockets);
                }
                if(sockets?.has(Socket) == false) {
                    sockets.add(Socket);
                }
            });
            
            const response = JSON.stringify({
                type : "rooms",
                payload : userRooms
            });
            Socket.send(response);
        }else if(data.type === 'history') {
            //return all the previous chats of this room to this user 
            const chatHistory = await MessageModel.find({
                roomId : data.payload.roomId
            }).populate("sender" , "_id username").sort({
                sentAt : -1
            }).limit(50);
            //message model does not store the senderinfo
            
            Socket.send(JSON.stringify({
                type: "history",
                payload: chatHistory
            }));

        } else{
            Socket.send(JSON.stringify({
                error : "Unsupported request"
            }));
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

