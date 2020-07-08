import {NextFunction, Request, Response} from "express";
import { QuickFlyDao } from "../daos/QuickFlyDao";
import { getPayloadFromResponse } from "../utils/authUtils";

export class QuickFlyController {

    private dao = new QuickFlyDao()

    /**
     * Get all utmsmg
     * @param request 
     * @param response 
     * @param next 
     */
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            let { role, username } = getPayloadFromResponse(response)
            let list = await this.dao.allByUser(username)
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
     * 
     * @param request 
     * @param response 
     * @param next 
     */
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            let { role, username } = getPayloadFromResponse(response)
            request.body.user = username
            let one = await this.dao.save(request.body)
            return response.json(one);
            
        } catch (error) {
            response.statusCode = 400
            return response.json(error)
        }
    }

}