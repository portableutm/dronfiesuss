import {NextFunction, Request, Response} from "express";
import { UTMMessageDao } from "../daos/UtmMessageDao";

export class UTMMessageController {

    private dao = new UTMMessageDao()

    /**
     * Get all utmsmg
     * @param request 
     * @param response 
     * @param next 
     */
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            let list = await this.dao.all()
            return response.json(list);
            
        } catch (error) {
            response.statusCode = 400
            return response.json(error)
        }
    }

    /**
     * Get one utm msg associated with id
     * @example /utmmessage/2
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
     * Save the utm message passed by POST
     * @example {
     *    severity: "INFORMATIONAL",
     *    uss_name: "DronfiesUSS",
     *    time_sent: "2019-12-11T19:59:10Z",
     *    message_type: "OPERATION_CONFORMING",
     *    free_text: "Texto libre"
     * }
     * @param request 
     * @param response 
     * @param next 
     */
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