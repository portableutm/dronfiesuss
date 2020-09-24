
import { NextFunction, Request, Response } from "express";
import { UASVolumeReservationDao } from "../daos/UASVolumeReservationDao";
import { UASVolumeReservation } from "../entities/UASVolumeReservation";
import { OperationVolume } from "../entities/OperationVolume";
import { OperationDao } from "../daos/OperationDaos";
import { Operation, OperationState } from "../entities/Operation";
import { validateStringDateIso, dateTimeStringFormat } from "../utils/validationUtils"
import { sendOpertationStateChange } from "../services/asyncBrowserComunication";

export class UASVolumeReservationController {

    private dao = new UASVolumeReservationDao()
    private operationDao = new OperationDao()

    /**
     * Get all uvrs from database
     * @param request 
     * @param response 
     * @param next 
     */
    async all(request: Request, response: Response, next: NextFunction) {
        try {
            let list = await this.dao.all()
            return response.json(list);
        } catch (error) {
            response.status(400)
            return response.json(error)

        }
    }

    /**
     * Get the uvr with the id passed
     * @example /uasvolume/0a8c53a7-4300-472d-844b-c0cfed9f1b17 
     * @param request 
     * @param response 
     * @param next 
     */
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            let uas = await this.dao.one(request.params.id)
            return response.json(uas);
        } catch (error) {
            return response.sendStatus(404)
        }
    }

    /**
     * Save the passed operation by post
     * @example {
     *    "uss_name": null,
     *    "type": "DYNAMIC_RESTRICTION",
     *    "permitted_uas": [
     *        "PART_107"
     *    ],
     *    "required_support": [
     *        "ENHANCED_SAFE_LANDING"
     *    ],
     *    "cause": "MUNICIPALITY",
     *    "geography": { "type": "Polygon", "coordinates": [[[-56.159834861755364, -34.91795954238727], [-56.16240978240967, -34.92221734956747], [-56.15567207336426, -34.922569224576016], [-56.15395545959473, -34.920141256305946], [-56.159834861755364, -34.91795954238727]]] },
     *    "effective_time_begin": "2020-03-11T19:59:10.000Z",
     *    "effective_time_end": "2020-03-11T20:59:10.000Z",
     *    "actual_time_end": null,
     *    "min_altitude": "20",
     *    "max_altitude": "50",
     *    "reas
     * @param request 
     * @param response 
     * @param next 
     */
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            // console.log(`\n**********************************`)
            let errors = validateOperation(request.body)
            if (errors.length == 0) {
                let entitie = await this.dao.save(request.body)
                // entitie = await this.dao.save(request.body)
                // console.log(`New uvr ${entitie.message_id}`)
                //get operations that need to chage the state
                try {
                    let volume = createVolumeFromUvr(entitie)
                    let operations = await this.operationDao.getOperationByVolume(volume)
                    // console.log(JSON.stringify(operations, null, 2))
                    for (let index = 0; index < operations.length; index++) {
                        try {
                            const op: Operation = operations[index];
                            // console.log(`The operation ${op.gufi} intersect with this uvr`)
                            let newState: OperationState = getNextOperationState(op)
                            // console.log(`The opertion ${op.gufi} chage the state from ${op.state} to ${newState}`)
                            if (newState != op.state) {
                                op.state = newState
                                this.operationDao.updateState(op.gufi, newState)
                                let operationInfo = {
                                    gufi: op.gufi,
                                    state: newState
                                }
                                sendOpertationStateChange(operationInfo)
                            }

                        } catch (error) {
                            response.status(500)
                            return response.json({ msg: "Error when update operation status", error: error })
                        }
                    }
                }
                catch (error) {
                    response.status(500)
                    return response.json({ msg: "Error when trying to get operations", error: error })
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
        // case OperationState.ROGUE:
        //     break;
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