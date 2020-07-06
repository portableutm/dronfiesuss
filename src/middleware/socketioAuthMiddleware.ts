import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";


export const authMiddleware = (socket, next) => {
    let token = socket.handshake.query.token;
    let bypass = socket.handshake.query.bypass;
    console.log(`Middleware ${JSON.stringify(socket.handshake.query, null, 2)}`)
    let jwtPayload;
    try {
        if (token===undefined && bypass && ((process.env.NODE_ENV == "dev") || (process.env.NODE_ENV == "test")) ) {
            jwtPayload = {
                username: "admin",
                email: "admin@dronfies.com",
                role: "admin"
            }
            console.log(`Bypass:::->${JSON.stringify(jwtPayload)}`)
        } else {
          jwtPayload = <any>jwt.verify(token, jwtSecret);
        }
        socket.jwtPayload = jwtPayload;
        return next();
      } catch (error) {
        console.log(`Token error ${error}`)
        // return;
        return next(new Error('Authentication error'));
      }
}