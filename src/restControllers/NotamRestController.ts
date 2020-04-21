import {NextFunction, Request, Response} from "express";
import {  NotamDao } from "../daos/NotamDao";

export class NotamController {

    private dao = new NotamDao()

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            let date = request.query.date
            let polygonStr = request.query.polygon 

            let polygon  = undefined
            if(polygonStr){
                polygon = JSON.parse(decodeURIComponent(polygonStr))
            }
            let list
            if(date || polygon ){
                list = await this.dao.getNotamByDateAndArea(date, polygon)
            }else{
                list = await this.dao.all()
            }
            return response.json(list);
        } catch (error) {
            console.error("error")
            console.error(error)
            response.statusCode = 400
            return response.json(error)
        }
    }


    async allWithFilters(request: Request, response: Response, next: NextFunction) {
        try {
            let list = await this.dao.all()
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