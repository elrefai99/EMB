import { asyncHandler } from "../../../utils/asyncHandler.utils";
import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import ServerError from "../../../utils/server.error.utils";
import { UserModel } from "../../../schema/user/user.schema";
import { accessToken } from "../../../utils/JWT/access.toke.jwt";

export const refreshController = asyncHandler(
     async (req: Request, res: Response, next: NextFunction) => {
        const cookie = req.cookies

        if(!cookie.refresh_token){
            next(new ServerError("No refrsh token founded, please sign in agin", 401));
            return
        }
        
        const refreshToken_KEY = process.env.REFRESH_TOKEN_KEY as string
        jwt.verify(cookie.refresh_token, refreshToken_KEY, async (err: any, decoded: any) => {
             if (err) {
                    next(new ServerError("Refrsh token is not valid, please sign in again", 401));
                    return
               }

               const foundUser = await UserModel.findOne({ _id: decoded._id, status: "active" }, {
                    _id: 1, tokenVersion: 1
               });

               if (!foundUser) {
                    next(new ServerError("User not founded", 404));
                    return
               }
               const token = accessToken(String(foundUser?._id));
               res.cookie("access_token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 1000 * 60 * 60 * 24 * 1, });
               res.status(200).json({ code: 200, status: "OK", message: "Success create new access token" });
        })  
    }
)