import mongoose from "mongoose";
export declare const UserModel: mongoose.Model<{
    username: string;
    password: string;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    username: string;
    password: string;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    username: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    username: string;
    password: string;
}, mongoose.Document<unknown, {}, {
    username: string;
    password: string;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    username: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    username: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    username: string;
    password: string;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const RoomModel: mongoose.Model<{
    name: string;
    CreatedAt: string;
    CreatedBy?: mongoose.Types.ObjectId | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    name: string;
    CreatedAt: string;
    CreatedBy?: mongoose.Types.ObjectId | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    name: string;
    CreatedAt: string;
    CreatedBy?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    name: string;
    CreatedAt: string;
    CreatedBy?: mongoose.Types.ObjectId | null;
}, mongoose.Document<unknown, {}, {
    name: string;
    CreatedAt: string;
    CreatedBy?: mongoose.Types.ObjectId | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    name: string;
    CreatedAt: string;
    CreatedBy?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    name: string;
    CreatedAt: string;
    CreatedBy?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    name: string;
    CreatedAt: string;
    CreatedBy?: mongoose.Types.ObjectId | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const MembershipModel: mongoose.Model<{
    role: "admin" | "member";
    joinedAt: NativeDate;
    userId?: mongoose.Types.ObjectId | null;
    roomId?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    role: "admin" | "member";
    joinedAt: NativeDate;
    userId?: mongoose.Types.ObjectId | null;
    roomId?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    role: "admin" | "member";
    joinedAt: NativeDate;
    userId?: mongoose.Types.ObjectId | null;
    roomId?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    role: "admin" | "member";
    joinedAt: NativeDate;
    userId?: mongoose.Types.ObjectId | null;
    roomId?: string | null;
}, mongoose.Document<unknown, {}, {
    role: "admin" | "member";
    joinedAt: NativeDate;
    userId?: mongoose.Types.ObjectId | null;
    roomId?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    role: "admin" | "member";
    joinedAt: NativeDate;
    userId?: mongoose.Types.ObjectId | null;
    roomId?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    role: "admin" | "member";
    joinedAt: NativeDate;
    userId?: mongoose.Types.ObjectId | null;
    roomId?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    role: "admin" | "member";
    joinedAt: NativeDate;
    userId?: mongoose.Types.ObjectId | null;
    roomId?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
export declare const MessageModel: mongoose.Model<{
    sender: string;
    sentAt: NativeDate;
    roomId?: string | null;
    content?: string | null;
}, {}, {}, {
    id: string;
}, mongoose.Document<unknown, {}, {
    sender: string;
    sentAt: NativeDate;
    roomId?: string | null;
    content?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    sender: string;
    sentAt: NativeDate;
    roomId?: string | null;
    content?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    sender: string;
    sentAt: NativeDate;
    roomId?: string | null;
    content?: string | null;
}, mongoose.Document<unknown, {}, {
    sender: string;
    sentAt: NativeDate;
    roomId?: string | null;
    content?: string | null;
}, {
    id: string;
}, mongoose.DefaultSchemaOptions> & Omit<{
    sender: string;
    sentAt: NativeDate;
    roomId?: string | null;
    content?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, unknown, {
    sender: string;
    sentAt: NativeDate;
    roomId?: string | null;
    content?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>, {
    sender: string;
    sentAt: NativeDate;
    roomId?: string | null;
    content?: string | null;
} & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=db.d.ts.map