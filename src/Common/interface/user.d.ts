import { EnumUser } from "../shared/enum/user.enum"

export interface IUserRequest{
    _id: any
    id: any
    fName: string
    lName: string
    username: string
    status: EnumUser
    email: string
    tokenVersion: number
}


export interface IUser{
    fName: string
    lName: string
    username: string
    email: string
    status: EnumUser
    password: string
    updatePassword: Date
    avatar: string
    phone: string
    tokenVersion: number
}