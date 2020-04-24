import { NextFunction, Request, Response } from "express";
import { VehicleDao } from "../daos/VehicleDao";
import {  } from "../daos/UserDaos";
import { VehicleReg } from "../entities/VehicleReg";
import { Role } from "../entities/User";
import { getPayloadFromResponse } from "../utils/authUtils";
import { genericTextLenghtValidation } from "../utils/validationUtils";

export class VehicleController {

    private dao = new VehicleDao()

    /**
     * Get all the vehicles, only admin can use
     * @param request 
     * @param response 
     * @param next 
     */
    async all(request: Request, response: Response, next: NextFunction) {
        let { role } = getPayloadFromResponse(response)
        if (role == Role.ADMIN) {
            let vehicles = await this.dao.all();
            return response.json(vehicles)
        } else {
            return response.sendStatus(401)
        }
    }

    //solo los propios si role piloto
    /**
     * Get one vehicle . Admin can see all vehicles, pilot only owned vehicles
     * @example /vehicle/bd9c2ea6-7ab7-442e-b99c-78890181c198
     * @param request 
     * @param response 
     * @param next 
     */
    async one(request: Request, response: Response, next: NextFunction) {
        try {
            let { role, username } = getPayloadFromResponse(response)
            if (role == Role.ADMIN) {
                let v = await this.dao.one(request.params.id);
                return response.json(v)
            } else {
                let v = await this.dao.oneByUser(request.params.id, username);
                return response.json(v)
                // return response.sendStatus(401)
            }

        } catch (error) {
            return response.sendStatus(404)
        }


    }

    /**
     * Save the vehicle passed in post
     * @example {
     *     "nNumber": "",
     *     "faaNumber": "faaNumber_81128",
     *     "vehicleName": "vehicle_name828",
     *     "manufacturer": "PIXHAWK",
     *     "model": "model_828",
     *     "class": "Fixed wing",
     *     "accessType": "",
     *     "vehicleTypeId": "",
     *     "org-uuid": "",
     *     "registeredBy": "userX"
     * }
     * @param request 
     * @param response 
     * @param next 
     */
    async save(request: Request, response: Response, next: NextFunction) {
        let v: VehicleReg = await this.dao.save(request.body);
        v.date = undefined
        let errors = validateVehicle(v)
        if (errors.length == 0) {
            let insertedVehicle = await this.dao.save(v)
            return response.json(insertedVehicle);
        } else {
            response.status(400)
            return response.json(errors)
        }
    }

}


function validateVehicle(v: VehicleReg) {
    let errors = []
    if (!genericTextLenghtValidation(v.vehicleName)) {
        errors.push("Invalid vehicle name")
    }
    return errors
}