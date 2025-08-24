import "express";
import { IUserRequest } from "../../Common/interface/user";

declare global {
     namespace Express {
          export interface Request {
               user?: IUserRequest;
               lang?: any;
               governorate?: any
               city?: any;
               clientIP?: any;
          }
     }
}

export { };