import {NextFunction, Request, Response} from "express";
import { PositionDao } from "../daos/PositionDao";

import { app } from "../index";


export class PositionController {

    private dao = new PositionDao()

    async all(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.all());
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.one(request.params.id));
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try{
            let position = await this.dao.save(request.body)
            console.log(`Send new position ${position}`)
            app.io.emit('new-position', position)
            return response.json(position);

        }catch(error){
            return response.sendStatus(400);
        }

    }

}