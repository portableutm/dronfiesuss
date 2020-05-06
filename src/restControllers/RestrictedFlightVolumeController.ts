
import { NextFunction, Request, Response } from "express";
import { RestrictedFlightVolumeDao } from "../daos/RestrictedFlightVolumeDao";
import { RestrictedFlightVolume } from "../entities/RestrictedFlightVolume";
import { OperationVolume } from "../entities/OperationVolume";
import { OperationDao } from "../daos/OperationDaos";
import { Operation, OperationState } from "../entities/Operation";
import { validateStringDateIso, dateTimeStringFormat } from "../utils/validationUtils"

export class RestrictedFlightVolumeController {

    private dao = new RestrictedFlightVolumeDao()
    private operationDao = new OperationDao()

    /**
     * Get all rfv from database
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
     * Get the rfv with the id passed
     * @example /restrictedflightvolume/0a8c53a7-4300-472d-844b-c0cfed9f1b17 
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
        // return response.json(await this.dao.one(request.params.id));
    }

    /**
     * Save the passed RestrictedFlightVolume by post
     * @example {
            geography: {"type":"Polygon","coordinates":[[[-56.309738,-34.874384],[-56.309395,-34.903671],[-56.245537,-34.9017],[-56.24588,-34.864806],[-56.310081,-34.872975],[-56.309738,-34.874384]]]},
            max_altitude: 100,
            min_altitude: 0,
            comments: "Montevideo Hill"
        }
     * @param request 
     * @param response 
     * @param next 
     */
    async save(request: Request, response: Response, next: NextFunction) {
        try {
            let entitie = await this.dao.save(request.body)
            entitie = await this.dao.save(request.body)
            let volume = createVolumeFromRestrictedFlightVolume(entitie)
            let operations = await this.operationDao.getOperationByPolygonAndAltitude(volume)
            for (let index = 0; index < operations.length; index++) {
                const op: Operation = operations[index];
                let newState: OperationState = getNextOperationState(op)
                if (newState != op.state) {
                    op.state = newState
                    this.operationDao.updateState(op.gufi, newState)
                }
            }
            return response.json(entitie);
            
        } catch (error) {
            return response.sendStatus(400);
        }

    }

}


function createVolumeFromRestrictedFlightVolume(uvr: RestrictedFlightVolume) {
    let operationVolume: OperationVolume = new OperationVolume()

    let baseDate = new Date();
    operationVolume.effective_time_begin = baseDate.toISOString()

    let endDate = new Date(baseDate)
    endDate.setFullYear(baseDate.getFullYear() + 3)
    operationVolume.effective_time_end = endDate.toISOString()

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
        // case OperationState.NOT_ACCEPTED:
        //     break;
        case OperationState.ACCEPTED:
            newState = OperationState.CLOSED
            break;
        case OperationState.ACTIVATED:
            newState = OperationState.CLOSED
            break;
        // case OperationState.NONCONFORMING:
        //     // newState = OperationState.ROGUE
        //     break;
        // case OperationState.ROGUE:
        //     break;
        default:
            break;
    }
    return newState

}



