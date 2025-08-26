import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.utils";
import jwt from "jsonwebtoken";
import { UserModel } from "../../schema/user/user.schema";
import ServerError from "../../utils/server.error.utils";
import { EnumUser } from "../../Common/shared/enum/user.enum";

export const pendingMiddleware = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const tokenFromAuthHeader = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
        const tokenFromHeader = req.headers.token as string;
        const tokenFromQuery = req.query.token as string;
        const cookie = req.cookies;

         // Use the first available token
         const token = tokenFromAuthHeader || tokenFromHeader || tokenFromQuery || cookie.access_token;

         if (token) {
          const TOKEN_SECRET_KEY = process.env.PENDING_TOKEN_SECRET as string;
          jwt.verify(token, TOKEN_SECRET_KEY, async (err: any, decoded: any) => {
               if (err) {
                    res.status(403).json({ code: 403, status: "Forbidden", message: "there was an error creating with Token", });
                    return;
               }
               const user: any = await UserModel.findOne({ _id: decoded._id, status: EnumUser.live }, {
                    _id: 1,
               });
               if (user) {
                    req.user = user;
                    next();
               }
               else {
                    res.status(403).json({ code: 403, status: "Forbidden", message: "The server is refusing to give the requested resource" });
               }
          });
     } else {
          res.status(401).json({ code: 401, status: "Unauthorized", message: "Authentication failed", });
          next(new ServerError("Authentication failed", 401))
          return
     }
    }
)