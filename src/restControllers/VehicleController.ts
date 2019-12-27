import {NextFunction, Request, Response} from "express";
import { VehicleDao } from "../daos/VehicleDao";

export class UTMMessageController {

    private dao = new VehicleDao()

    async all(request: Request, response: Response, next: NextFunction) {
        return this.dao.all();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.dao.one(parseInt(request.params.id));
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.dao.save(request.body);
    }

}