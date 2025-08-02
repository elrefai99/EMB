import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet"
import cookieParser from "cookie-parser";
import morgan from "morgan";
import cors from "cors"
import useragent from "express-useragent";
import requestIp from "request-ip";

export default (app: Application) => {

     const allowedOrigins = [process.env.SITE_URL_TEST as string, process.env.SITE_URL_LIVE as string];
     const corsOptions = {
          origin: (origin: any, callback: any) => {
               if (allowedOrigins.includes(origin) || !origin) {
                    callback(null, true);
               } else {
                    callback(new Error("Not allowed by CORS"));
               }
          },
          credentials: true,
          optionsSuccessState: 200,
     };

     // Server App
     app.use(cors(corsOptions))
     app.use(express.json())
     app.use(helmet())
     app.use(cookieParser())
     app.use(morgan(process.env.NODE_ENV == "development" ? "dev" : "combined"))
     app.use(useragent.express());
     app.use(requestIp.mw());
     app.set("trust proxy", true);
     app.use(async (req: Request | any, _res: Response, next: NextFunction) => {
          // get langouage of headers
          const lang = req.headers['accept-language'];
          req.lang = (lang === 'ar' || lang === 'en') ? lang : 'en';

          // ip address of users
          const clientIP = req.headers["cf-connecting-ip"] || req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
          req.clientIP = clientIP;

          next();
     });
}
