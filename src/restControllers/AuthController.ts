// import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import * as jwt from "jsonwebtoken";

import {User} from "../entities/User";
import { UserDao } from "../daos/UserDaos";

import { checkIfUnencryptedPasswordIsValid } from "../services/encrypter";
import {jwtSecret} from "../config/config";

export class AuthController {

    private dao = new UserDao()

    async login(request: Request, response: Response, next: NextFunction) {
        let username :string = request.body.username
        let password :string = request.body.password
        console.log(`username: ${username}, password:${password}`)

        let user : User
        try {
            user = await this.dao.one(username)    
        } catch (error) {
            console.log(`Error al obtener usuarios`)
            console.error(error)
            return response.sendStatus(404);
        }
        
        let credentialValid : boolean = checkIfUnencryptedPasswordIsValid(password, user.password)
        console.log(`- credentialValid: ${credentialValid}`)

        if(credentialValid){
            //Sing JWT, valid for 1 hour
            const user_obj = {
                username: user.username,
                email: user.email
            }
            try {
                const token = jwt.sign(
                    // { userId: user., username: user.username },
                    user_obj,
                    jwtSecret,
                    { expiresIn: "1h" }
                );    
                console.log(`token:${token}(${typeof token})`)
                return response.send(token);
            } catch (error) {
                console.log(`Error al obtener token`)
                console.error(error)
                return response.sendStatus(401);
            }
            
        } else {
            return response.sendStatus(401);
        }
        

        // return response.send(token);
    }
    

    // async one(request: Request, response: Response, next: NextFunction) {
    //     return this.dao.one(request.params.username);
    // }

    // async save(request: Request, response: Response, next: NextFunction) {
    //     let user: User = request.body
    //     user.password = hashPassword(user.password)
    //     return this.dao.save(user);
    // }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     // let userToRemove = await this.dao.one(request.params.id);
    //     await this.dao.remove(request.params.username);
    // }

}