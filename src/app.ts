process
     .on("unhandledRejection", (reason, p) => {
          console.error(reason, "Unhandled Rejection at Promise", p);
     })
     .on("uncaughtException", (err) => {
          console.error(err, "Uncaught Exception thrown");
          console.log("LOL");
          process.exit(1);
     });
import 'reflect-metadata';
import "dotenv/config"
import express from 'express'
import * as http from 'node:http'
import { Server as SocketIOServer } from 'socket.io'


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
     console.log("Server is running in link: http://localhost:9000")
})
