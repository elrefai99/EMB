import { model, Schema } from "mongoose";
import { IUser } from "../../Common/interface/user";

const userSchema = new Schema<IUser>({
    fName: {
        type:String,
        required: true,
        trim: true,
    },
    lName: {
        type:String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
        toLowerCase: true,
        trim: true
    },
    password: {
          type: String,
          required: true,
     },
     updatePassword: {
          type: Date,
          default: Date.now,
          index: true,
     },
     avatar: {
          type: String,
          default: '',
     },
     phone: {
          type: String,
          default: '',
          index: true,
     },
     tokenVersion: {
        type: Number,
        default: 0
     }
}, {
    timestamps: true
})

export const UserModel = model<IUser>("User", userSchema)