import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { UserDao } from "../daos/UserDaos";
import { checkIfUnencryptedPasswordIsValid } from "../services/encrypter";
import {jwtSecret} from "../config/config";
import { getUserFields } from "../utils/authUtils";

export class AuthController {

    private dao = new UserDao()

    async login(request: Request, response: Response, next: NextFunction) {
        let username :string = request.body.username
        let password :string = request.body.password
        let format :string = request.body.format
        // console.log(`username: ${username}, password:${password}`)

        let user : User
        try {
            user = await this.dao.one(username)  
              
        } catch (error) {
            // console.log(`Error al obtener usuarios`)
            // console.error(error)
            return response.sendStatus(401);
        }
        
        let credentialValid : boolean = checkIfUnencryptedPasswordIsValid(password, user.password)
        // console.log(`- credentialValid: ${credentialValid}`)

        if(credentialValid){
            //Sing JWT, valid for 1 hour
            const user_obj = getUserFields(user)
            try {
                const token = jwt.sign(
                    user_obj,
                    jwtSecret,
                    { expiresIn: "1h" }
                );    
                // console.log(`token:${token}(${typeof token})`)
                if(format){
                    response.json({token})
                }else{
                    return response.send(token);
                }
                
            } catch (error) {
                // console.log(`Error al obtener token`)
                // console.error(error)
                return response.sendStatus(401);
            }
            
        } else {
            return response.sendStatus(401);
        }
        

    }
}

