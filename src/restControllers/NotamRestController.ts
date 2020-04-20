import {NextFunction, Request, Response} from "express";
import {  NotamDao } from "../daos/NotamDao";

export class NotamController {

    private dao = new NotamDao()

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            let list = await this.dao.all()
            // console.log(`Las no tams: ${JSON.stringify(list)}`)
            return response.json(list);
            
        } catch (error) {
            response.statusCode = 400
            return response.json(error)
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            let one = await this.dao.one(request.params.id)
            return response.json(one);
            
        } catch (error) {
            response.statusCode = 404
            return response.json(error)
        }
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            let one = await this.dao.save(request.body)
            return response.json(one);
            
        } catch (error) {
            response.statusCode = 400
            return response.json(error)
        }
    }

}