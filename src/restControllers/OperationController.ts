import {NextFunction, Request, Response} from "express";
import { OperationDao } from "../daos/OperationDaos";

export class OperationController {

    private dao = new OperationDao()

    async all(request: Request, response: Response, next: NextFunction) {
      let state = request.query.state;
      return this.dao.all({state:state});
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.dao.one(request.params.guifi);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.dao.save(request.body);
    }

    async getOperationByPoint(request: Request, response: Response, next: NextFunction) {
      return this.dao.getOperationByPoint(request.body)
    }

    async getOperationByVolumeOperation(request: Request, response: Response, next: NextFunction) {
      return this.dao.getOperationByVolume(request.body)
    }

    private parseQuery(query: Express.Request) {
      
    }

}