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

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            let gufi = request.body.gufi
            let errors = [];
            errors = validatePosition(request.body)
            if (errors.length == 0) {
                //save position
                let position = await this.dao.save(request.body)

                //check if position is inside de operation volume of associated operation 
                // console.log(`Entrando al checker con  ${JSON.stringify(position, null, 2)}`)
                let res = await this.dao.checkPositionWithOperation(position)
                let { inOperation } = res
                if (!inOperation) {
                    console.log("------------ Vuela fuera actualizo")
                    if (this.operationDao == undefined) {
                        this.operationDao = new OperationDao();
                    }
                    //if position is not inside the associated operation then change operation status as ROUGE

                    // console.log(await this.operationDao.updateState(gufi, OperationState.ROGUE))
                    this.operationDao.updateState(gufi, OperationState.ROGUE)

                    
                    // let op = await this.operationDao.one(gufi); 
                    // op.state = OperationState.ROGUE
                    // let savedOp = await this.operationDao.save(op);
                    // console.log(`Saved op ${JSON.stringify(savedOp)} `)
                } else {
                    console.log("------------ Vuela ok")
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