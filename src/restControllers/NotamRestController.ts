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
            let notam = request.body
            let one = await this.dao.save(notam)
            let id = one.identifiers[0]
            notam.message_id = id.message_id
            // console.log(JSON.stringify(one, null, 2))
            return response.json(notam);
            
        } catch (error) {
            response.statusCode = 400
            return response.json(error)
        }
    }

}