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
        // console.log(`Login: ${JSON.stringify(request.body)}, ${JSON.stringify(request.params)}`)
        // let {username, password} = request.body
        let username :string = request.body.username
        let password :string = request.body.password
        console.log(`username: ${username}, password:${password}`)

        console.log(await this.dao.all())


        let user : User = await this.dao.one(username)

        let credentialValid : boolean = checkIfUnencryptedPasswordIsValid(password, user.password)

        console.log(`- credentialValid: ${credentialValid}`)

        //Sing JWT, valid for 1 hour
        if(credentialValid){
            const user_obj = {
                username: user.username,
                email: user.email
            }
            const token = jwt.sign(
                // { userId: user., username: user.username },
                user_obj,
                jwtSecret,
                { expiresIn: "1h" }
            );
            return response.send(token);
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