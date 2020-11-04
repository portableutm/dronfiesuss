import { NextFunction, Request, Response } from "express";
import { ParaglidingPositionDao } from "../daos/ParaglidingPositionDao";
import { OperationDao } from "../daos/OperationDaos";

// import { app } from "../index";
import { sendPositionToMonitor, sendOperationFlyStatus, sendParaglidingPositionToMonitor } from "../services/asyncBrowserComunication";
import { Position } from "../entities/Position";
import { OperationState } from "../entities/Operation";
import { getPayloadFromResponse } from "../utils/authUtils";
import { ParaglidingPosition } from "../entities/ParaglidingPosition";


export class ParaglidingPositionController {

    private dao = new ParaglidingPositionDao()
    private operationDao: OperationDao;

    async all(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.all());
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.one(request.params.id));
    }

    /**
     * Save a position. If the position dont intersect with associated operation change the state to ROUGE
     * @example {
     *     "altitude": 30,
     *     "location": {"type": "Point","coordinates": [-56.1636114120483,-34.9068213410793]},
     *     "time_sent": "2019-12-11T19:59:10.000Z",
     * }
     * @param request 
     * @param response 
     * @param next 
     */
    async save(request: Request, response: Response, next: NextFunction) {
        try {

            let { role, username } = getPayloadFromResponse(response)
            let pos = request.body
            pos.user = { username : username }
            
            let position = await this.dao.save(pos)

            sendParaglidingPositionToMonitor(position)
            return response.json(position);


        } catch (error) {
            console.error(error)
            return response.sendStatus(400);
        }

    }

    // /**
    //  * Save a position. If the position dont intersect with associated operation change the state to ROUGE
    //  * @example {
    //  *     "altitude_gps": 30,
    //  *     "location": {"type": "Point","coordinates": [-56.1636114120483,-34.9068213410793]},
    //  *     "time_sent": "2019-12-11T19:59:10.000Z",
    //  *     "uvin" : "f7891e78-9bb4-431d-94d3-1a506910c254",
    //  *     "heading" : 160
    //  * }
    //  * @param request 
    //  * @param response 
    //  * @param next 
    //  */
    // async savePositionWithDrone(request: Request, response: Response, next: NextFunction) {
    //     try {
    //         let { role, username } = getPayloadFromResponse(response)


    //         // // let errors = [];
    //         // // errors = validatePosition(request.body)
    //         const { uvin, altitude_gps, location, time_sent, heading } = request.body
    //         // // if (errors.length == 0) {
    //         // //     //save position
    //         // //     if (this.operationDao == undefined) {
    //         // //         this.operationDao = new OperationDao();
    //         // //     }
    //         // //     let operations = await this.operationDao.getOperationByPositionAndDrone(location,altitude_gps, time_sent, uvin)
    //         // //     console.log(`\t*** ${JSON.stringify(operations, null, 2)}`)
    //         // //     if(operations.length > 1){
    //         // //         throw "There are more than one operation"
    //         // //     }
    //         // //     if(operations.length == 0){
    //         // //         throw "No operation on the drone flight"
    //         // //     }
    //         // //     let operation = operations[0]
    //         // //     let posToSave  = {
    //         // //         altitude_gps : request.body.altitude_gps,
    //         // //         location : request.body.location,
    //         // //         time_sent : request.body.time_sent,
    //         // //         gufi: operation,
    //         // //         heading: heading
    //         // //     }

    //         // //     let position = await this.dao.save(posToSave)

    //         // //     //send information to web browser
    //         // //     sendOperationFlyStatus(true)
    //         // //     // console.log(`Send new position ${position}`)
    //         // //     sendPositionToMonitor(position, operation.controller_location)
    //         // //     return response.json(position);
    //         // } else {
    //         //     response.status(400)
    //         //     return response.json(errors)
    //         // }
    //     } catch (error) {
    //         console.error(error)
    //         return response.sendStatus(400);
    //     }

    // }



}


function validatePosition(position: any) {
    let errors = []
    if (position.heading != undefined) {
        if (!((typeof position.heading == 'number') && (position.heading >= -180) && (position.heading <= 180))) {
            errors.push('Invalid heading')
        }
    }
    return errors

}