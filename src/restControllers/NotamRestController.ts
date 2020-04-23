import {NextFunction, Request, Response} from "express";
import {  NotamDao } from "../daos/NotamDao";

export class NotamController {

    private dao = new NotamDao()

    /**
     * Return all notams
     * If have query parameters date or polygon filter the notams:
     *      date : String with format yyyy-mm-ddThh:mm:ss.mmmZ return notams that pased date are between start and end date of notams
     *      polygon : Geojson.polygon encoded with encodeURIComponent return notams that intersect with pased polygon
     * @example /notams/?date=2020-04-11T16:00:00Z&polygon=%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-56.143227%2C-34.898885%5D%2C%5B-56.143827%2C-34.902756%5D%2C%5B-56.128893%2C-34.901912%5D%2C%5B-56.128893%2C-34.897688%5D%2C%5B-56.143227%2C-34.898885%5D%5D%5D%7D
     * @param request 
     * @param response 
     * @param next 
     */
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


    // async allWithFilters(request: Request, response: Response, next: NextFunction) {
    //     try {
    //         let list = await this.dao.all()
    //         return response.json(list);
            
    //     } catch (error) {
    //         response.statusCode = 400
    //         return response.json(error)
    //     }
    // }

    /**
     * return the notams that has an id paramter
     * to set this must send the id on the url /notams/:id
     * @example /notam/f2308be3-80a5-4247-964a-b541a1634331
     * @param request 
     * @param response 
     * @param next 
     */
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            let one = await this.dao.one(request.params.id)
            return response.json(one);
            
        } catch (error) {
            response.statusCode = 404
            return response.json(error)
        }
    }

    /**
     * request.body must have an Notams object
     * @example {
            text : "For test",
            geography: { "type": "Polygon", "coordinates": [ [ [ -56.17652893066406, -34.895857623250066 ], [ -56.18107795715332, -34.90493843104419 ], [ -56.17069244384765, -34.909091334089794 ], [ -56.164255142211914, -34.90092610489535 ], [ -56.17652893066406, -34.895857623250066 ] ] ] },
            effective_time_begin: "2020-04-20T14:00:00Z",
            effective_time_end: "2020-04-21T14:00:00Z",
        }
     * @param request 
     * @param response 
     * @param next 
     */
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