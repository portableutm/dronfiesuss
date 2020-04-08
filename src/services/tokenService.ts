import * as jwt from "jsonwebtoken";
import { jwtSecret, jwtExpTime } from "../config/config";


export function getToken(email, username, role) {
    const newToken = jwt.sign({ email, username, role }, jwtSecret, {
        expiresIn: jwtExpTime
    });
    return newToken;
}