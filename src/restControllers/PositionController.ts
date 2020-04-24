import { NextFunction, Request, Response } from "express";
import { PositionDao } from "../daos/PositionDao";
import { OperationDao } from "../daos/OperationDaos";

// import { app } from "../index";
import { sendPositionToMonitor, sendOperationFlyStatus } from "../services/asyncBrowserComunication";
import { Position } from "../entities/Position";
import { OperationState } from "../entities/Operation";


export class PositionController {

    private dao = new PositionDao()
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
     *     "altitude_gps": 30,
     *     "location": {"type": "Point","coordinates": [-56.1636114120483,-34.9068213410793]},
     *     "time_sent": "2019-12-11T19:59:10.000Z",
     *     "gufi" : "f7891e78-9bb4-431d-94d3-1a506910c254",
     *     "heading" : 160
     * }
     * @param request 
     * @param response 
     * @param next 
     */
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            let gufi = request.body.gufi
            let errors = [];
            errors = validatePosition(request.body)
            if (errors.length == 0) {
                //save position
                let position = await this.dao.save(request.body)

                //check if position is inside de operation volume of associated operation 
                let res = await this.dao.checkPositionWithOperation(position)
                let { inOperation } = res
                if (!inOperation) {
                    // console.log("------------ Vuela fuera actualizo")
                    if (this.operationDao == undefined) {
                        this.operationDao = new OperationDao();
                    }
                    //if position is not inside the associated operation then change operation status as ROUGE
                    this.operationDao.updateState(gufi, OperationState.ROGUE)
                    
                } else {
                    // console.log("------------ Vuela ok")
                }

                //send information to web browser
                sendOperationFlyStatus(inOperation)
                console.log(`Send new position ${position}`)
                sendPositionToMonitor(position)
                return response.json(position);
            }else {
                response.status(400)
                return response.json(errors)
            }
        } catch (error) {
            console.error(error)
            return response.sendStatus(400);
        }

    }



}


function validatePosition(position: any) {
    let errors = []
    if(position.heading != undefined){
        if (!( (typeof position.heading == 'number') && (position.heading >= -180) && (position.heading <= 180) ) ) {
            errors.push('Invalid heading')
        }
    }
    return errors

}