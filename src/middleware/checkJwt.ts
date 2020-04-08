import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecret, jwtExpTime } from "../config/config";
import { getUserFields } from "../utils/authUtils";


export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["auth"];
  const bypass = <string>req.headers["bypass"];
  let jwtPayload;

  //Try to validate the token and get data
  try {
    if (token===undefined && bypass && ((process.env.NODE_ENV == "dev") || (process.env.NODE_ENV == "test")) ) {
      jwtPayload = {
        username: "admin",
        email: "admin@dronfies.com",
        role: "admin"
      }
      // console.log(" ********* ******** ******* ")
      // console.log(`Using bypass: this only for dev or test. ${JSON.stringify(jwtPayload)}`)
      // console.log(" ********* ******** ******* ")
    } else {
      jwtPayload = <any>jwt.verify(token, jwtSecret);
    }
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {

    //If token is not valid, respond with 401 (unauthorized)
    console.log(`Token error ${error}`)
    res.status(401).send();
    return;
  }
  
  //The token is valid for 1 hour
  //We want to send a new token on every request
  const { email, username, role } = jwtPayload;
  const newToken = jwt.sign({ email, username, role }, jwtSecret, {
    expiresIn: jwtExpTime
  });
  res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
};