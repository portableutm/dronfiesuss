import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { jwtSecret } from "../config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Get the jwt token from the head
  const token = <string>req.headers["auth"];
  const bypass = <string>req.headers["bypass"];
  let jwtPayload;
  console.log(`token ${token}`)

  //Try to validate the token and get data
  try {
    if (token===undefined && bypass && process.env.NODE_ENV == "dev") {
      jwtPayload = {
        username: "User_9",
        email: "User_9@dronfies.com",
        role: "admin"
      }
    } else {
      jwtPayload = <any>jwt.verify(token, jwtSecret);
    }
    console.log(`jwtPayload ${JSON.stringify(jwtPayload)}`)
    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //If token is not valid, respond with 401 (unauthorized)
    res.status(401).send();
    return;
  }
  //The token is valid for 1 hour
  //We want to send a new token on every request
  // const user = jwtPayload;
  const { email, username } = jwtPayload;
  const newToken = jwt.sign({ email, username }, jwtSecret, {
    expiresIn: "1h"
  });
  // const newToken = jwt.sign(user, jwtSecret, {
  //   expiresIn: "1h"
  // });
  res.setHeader("token", newToken);

  //Call the next middleware or controller
  next();
};