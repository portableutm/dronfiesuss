import { NextFunction, Request, Response } from "express";
import { User, Role } from "../entities/User";
import { UserDao } from "../daos/UserDaos";
import { hashPassword } from "../services/encrypter";
import { getPayloadFromResponse } from "../utils/authUtils";
import { genericTextLenghtValidation } from "../utils/validationUtils";

export class UserController {

    private dao = new UserDao()

    //solo admin   
    async all(request: Request, response: Response, next: NextFunction) {
        let { role } = getPayloadFromResponse(response)
        if (role == Role.ADMIN) {
            return response.json(await this.dao.all());
        }
        else {
            return response.sendStatus(401)
        }
    }

    //solo admin   
    async one(request: Request, response: Response, next: NextFunction) {
        let { role } = getPayloadFromResponse(response)
        if (role == Role.ADMIN) {
            return response.json(await this.dao.one(request.params.id));
        }
        else {
            return response.sendStatus(401)
        }

    }

    //solo admin   
    async save(request: Request, response: Response, next: NextFunction) {
        let { role } = getPayloadFromResponse(response)
        try {
            if (role == Role.ADMIN) {
                let user: User = request.body
                // trimFields(user)
                let errors = validateUser(user)
                if(errors.length==0){
                    user.password = hashPassword(user.password)
                    let insertedDetails = await this.dao.save(user)
                    return response.json(user);
                }else{
                    response.status(400)
                    return response.json(errors)
                }
            }
            else {
                return response.sendStatus(401)
            }
        } catch (error) {
            response.status(400)
            return response.json({"Error": "Insert fail"})
        }
        



    }




    // async remove(request: Request, response: Response, next: NextFunction) {
    //     // let userToRemove = await this.dao.one(request.params.id);
    //     await this.dao.remove(request.params.username);
    // }

}

function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return true
    }
    return false
}

function trimFields(user:User){
    // user.email = user.email.trim
    user.firstName = user.firstName.trim()
    user.lastName = user.lastName.trim()
    user.username = user.username.trim()
    
}

function validateUser(user: User) {
    console.log("Validando usuarios")
    console.log(user)
    let errors = []
    if (!validateEmail(user.email)){
        errors.push("Invalid email")
    }
    if(!genericTextLenghtValidation(user.firstName)){
        errors.push("Invalid first name")
    }
    if(!genericTextLenghtValidation(user.lastName)){
        errors.push("Invalid last name")
    }
    if(!genericTextLenghtValidation(user.password) ){
        errors.push("Invalid username")
    }
    return errors
    // return true
}