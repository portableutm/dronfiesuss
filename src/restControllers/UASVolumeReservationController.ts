
import { NextFunction, Request, Response } from "express";
import { UASVolumeReservationDao } from "../daos/UASVolumeReservationDao";
import { UASVolumeReservation } from "../entities/UASVolumeReservation";
import { OperationVolume } from "../entities/OperationVolume";
import { OperationDao } from "../daos/OperationDaos";
import { Operation, OperationState } from "../entities/Operation";
import { validateStringDateIso, dateTimeStringFormat } from "../utils/validationUtils"


// import { app } from "../index";
// import { sendPositionToMonitor } from "../services/asyncBrowserComunication";


export class UASVolumeReservationController {

    private dao = new UASVolumeReservationDao()
    private operationDao = new OperationDao()

    async all(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.all());
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.one(request.params.id));
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try {
            console.log(`\n**********************************`)
            let errors = validateOperation(request.body)
            let entitie = await this.dao.save(request.body)
            if (errors.length == 0) {
                entitie = await this.dao.save(request.body)
                console.log(`New uvr ${entitie.message_id}`)
                //get operations that need to chage the state
                let volume = createVolumeFromUvr(entitie)
                let operations = await this.operationDao.getOperationByVolume(volume)
                for (let index = 0; index < operations.length; index++) {
                    const op: Operation = operations[index];
                    console.log(`The operation ${op.gufi} intersect with this uvr`)
                    let newState: OperationState = getNextOperationState(op)
                    console.log(`The opertion ${op.gufi} chage the state from ${op.state} to ${newState}`)
                    if (newState != op.state) {
                        op.state = newState
                        this.operationDao.updateState(op.gufi, newState)
                    }
                }
                return response.json(entitie);
            } else {
                response.status(400)
                return response.json(errors)
            }
        } catch (error) {
            return response.sendStatus(400);
        }

    }

}


function createVolumeFromUvr(uvr: UASVolumeReservation) {
    let operationVolume: OperationVolume = new OperationVolume()
    operationVolume.effective_time_begin = uvr.effective_time_begin
    operationVolume.effective_time_end = uvr.effective_time_end
    operationVolume.min_altitude = uvr.min_altitude
    operationVolume.max_altitude = uvr.max_altitude
    operationVolume.operation_geography = uvr.geography
    return operationVolume
}

function getNextOperationState(operation: Operation) {
    // PROPOSED = "PROPOSED"
    // , ACCEPTED = "ACCEPTED"
    // , ACTIVATED = "ACTIVATED"
    // , CLOSED = "CLOSED"
    // , NONCONFORMING = "NONCONFORMING"
    // , ROGUE = "ROGUE",
    // NOT_ACCEPTED = "NOT_ACCEPTED"
    let newState: OperationState = operation.state
    switch (operation.state) {
        case OperationState.PROPOSED:
            newState = OperationState.CLOSED
            break;
        case OperationState.NOT_ACCEPTED:
            break;
        case OperationState.ACCEPTED:
            newState = OperationState.CLOSED
            break;
        case OperationState.ACTIVATED:
            newState = OperationState.ROGUE
            break;
        case OperationState.NONCONFORMING:
            newState = OperationState.ROGUE
            break;
        case OperationState.ROGUE:
            break;
        default:
            break;
    }
    return newState

}



function validateOperation(uvr: UASVolumeReservation) {
    let errors = []

    const effectiveTimeBeginValid = validateStringDateIso(uvr.effective_time_begin)
    if (!effectiveTimeBeginValid) {
        errors.push(`effective_time_begin ${uvr.effective_time_begin} must have the format ${dateTimeStringFormat}`)
    }
    const effectiveTimeEndValid = validateStringDateIso(uvr.effective_time_end)
    if (!effectiveTimeEndValid) {
        errors.push(`effective_time_end ${uvr.effective_time_end} must have the format ${dateTimeStringFormat}`)
    }
    return errors
}