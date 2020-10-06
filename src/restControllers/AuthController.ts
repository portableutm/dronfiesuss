import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { UserDao } from "../daos/UserDaos";
import { checkIfUnencryptedPasswordIsValid } from "../services/encrypter";
import {jwtSecret} from "../config/config";
import { getUserFields } from "../utils/authUtils";
import { Status } from "../entities/UserStatus";

export class AuthController {

    private dao = new UserDao()


    
    /**
     * Request must have in body the next object
     * {    
     *  username:String,
     *  password:String,
     *  format?:"json"
     * }
     * If user and password are valid, return token.
     * If format= json return json { token : String} else return token as a plain text
     * 
     * @param  {Request} request
     * @param  {Response} response
     * @param  {NextFunction} next
     */
    async login(request: Request, response: Response, next: NextFunction) {
        let username :string = request.body.username
        let password :string = request.body.password
        let format :string = request.body.format

        let user : User
        try {
            user = await this.dao.oneWithPassword(username)  
            console.log(`Useeeer:::${JSON.stringify(user)}`)
            if(user==undefined){
                return response.sendStatus(401);
            }
            
            const status = await user.status;
            if(status.status == Status.UNCONFIRMED){
                response.statusCode = 401
                return response.json({token:"", error:"Unconfirmed user"})
            }
              
        } catch (error) {
            // console.log(`Error al obtener usuarios`)
            console.error(error)
            return response.sendStatus(401);
        }
        let credentialValid : boolean = checkIfUnencryptedPasswordIsValid(password, user.password)

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
                    return response.json({token})
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

