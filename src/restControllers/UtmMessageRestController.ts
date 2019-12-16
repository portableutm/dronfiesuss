import {getRepository, In, Raw} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Operation} from "../entities/Operation";
import { UTMMessageDao } from "../daos/UtmMessageDao";

export class UTMMessageController {

    // private operationRepository = getRepository(Operation);
    private dao = new UTMMessageDao()

    async all(request: Request, response: Response, next: NextFunction) {
        return this.dao.all();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.dao.one(-1);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.dao.save(request.body);
    }

  //   async getOperationByPoint(request: Request, response: Response, next: NextFunction) {
  //     return this.dao.getOperationByPoint(request.body)
  // }

    

}