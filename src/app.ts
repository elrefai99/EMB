process
     .on("unhandledRejection", (reason, p) => {
          console.error(reason, "Unhandled Rejection at Promise", p);
     })
     .on("uncaughtException", (err) => {
          console.error(err, "\n Uncaught Exception thrown \n");
          console.log("LOL");
          process.exit(1);
     });
import 'reflect-metadata';
import "dotenv/config"
import express from 'express'
import * as http from 'node:http'
import { Server as SocketIOServer } from 'socket.io'
import { mongoDBConfig } from './config/MongoDB.config';


const app = express()
const server = http.createServer(app)
export let ioSocket: SocketIOServer;

ioSocket = new SocketIOServer(server, {
     cors: {
          origin: '*',
     },
})

const port = Number(process.env.PORT) || 9000

server.listen(port, () => {
     mongoDBConfig()
     console.log("🖥️  Server is running in link:", process.env.NODE_ENV == "development" ? process.env.LOCAL_API_URL : process.env.GLOPAL_API_URL)
})
