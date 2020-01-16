import {NextFunction, Request, Response} from "express";
import { VehicleDao } from "../daos/VehicleDao";
import { VehicleReg } from "../entities/VehicleReg";

export class VehicleController {

    private dao = new VehicleDao()
    
    // let x = {a: 1, b: 2, c: 3, z:26};
    // let {b, ...y} = x;
    // b ==2
    // y == {a: 1, c: 3, z:26};

    async all(request: Request, response: Response, next: NextFunction) {
        let vehicles = await this.dao.all();
        return response.json(vehicles)
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try{
            let v = await this.dao.one(request.params.id);
            return response.json(v)
        }catch(error){
            return response.sendStatus(404)
        }
        
        
    }

    async save(request: Request, response: Response, next: NextFunction) {
        let v = await this.dao.save(request.body);
        return response.json(v)
    }

}