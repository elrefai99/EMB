import { connect } from "mongoose"
import os from 'node:os';
function getLocalIP(): any {
     const interfaces = os.networkInterfaces();
     for (const name in interfaces) {
          for (const iface of interfaces[name]!) {
               if (iface.family === 'IPv4' && !iface.internal) {
                    return iface.address;
               }
          }
     }
}
export const mongoDBConfig = () => {
     const uriLive = process.env.MONGO_URI as string

     connect(uriLive).then(() => {
          console.log(`✅ Success connected to Lesoll Chat ${process.env.NODE_ENV === "development" ? "Test" : "Live"} Database`)
          console.log('ɪᴘ My IP Address:', getLocalIP());
     }).catch((err) => {
          console.error("MongoDB connection error:", err)
          process.exit(1)
     })
}
