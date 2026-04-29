import mongoose from "mongoose";
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
});
const RoomSchema = new Schema({
    name: { type: String, required: true },
    CreatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    CreatedAt: { type: String, default: Date.now() }
});
const MembershipSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'room' },
    role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
    },
    joinedAt: { type: Date, default: Date.now }
});
MembershipSchema.index({ userId: 1, roomId: 1 }, { unique: true });
const MessageSchema = new Schema({
    sender: { type: String, required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'room' },
    content: { type: String },
    sentAt: { type: Date, default: Date.now() }
});
export const UserModel = mongoose.model('users', UserSchema);
export const RoomModel = mongoose.model('room', RoomSchema);
export const MembershipModel = mongoose.model('membership', MembershipSchema);
export const MessageModel = mongoose.model('messages', MessageSchema);
//# sourceMappingURL=db.js.map