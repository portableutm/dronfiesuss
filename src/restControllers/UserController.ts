import {NextFunction, Request, Response} from "express";
import {User} from "../entities/User";
import { UserDao } from "../daos/UserDaos";
import { hashPassword } from "../services/encrypter";

export class UserController {

    private dao = new UserDao()

    async all(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.all());
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.one(request.params.id));
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let user: User = request.body
        user.password = hashPassword(user.password)
        return response.json( await this.dao.save(user));
    }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     // let userToRemove = await this.dao.one(request.params.id);
    //     await this.dao.remove(request.params.username);
    // }

}