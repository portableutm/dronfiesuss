import {NextFunction, Request, Response} from "express";
import { VehicleDao } from "../daos/VehicleDao";

export class VehicleController {

    private dao = new VehicleDao()
    
    // let x = {a: 1, b: 2, c: 3, z:26};
    // let {b, ...y} = x;
    // b ==2
    // y == {a: 1, c: 3, z:26};

    async all(request: Request, response: Response, next: NextFunction) {
        return this.dao.all();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        console.log(request.body)
        return this.dao.one(parseInt(request.params.id));
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.dao.save(request.body);
    }

}