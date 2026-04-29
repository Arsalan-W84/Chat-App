import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username : {type : String  , required : true} , 
    password : {type : String , required : true}
});

const RoomSchema = new Schema({
    name : {type : String , required : true } , 
    CreatedBy : { type : mongoose.Schema.Types.ObjectId , ref : 'users'} , 
    CreatedAt : { type : String , default : Date.now() }
});

const MessageSchema = new Schema({
    sender : { type : String , required : true } ,
    RoomId : { type : mongoose.Schema.Types.ObjectId , ref : 'room' }  ,
    content : {type : String } , 
    createdAt : {type : Date , default : Date.now()}
});

export const UserModel =  mongoose.model('users' , UserSchema) ;
export const RoomModel =  mongoose.model('room' , RoomSchema) ;
export const MessageModel =  mongoose.model('messages' , MessageSchema) ;
