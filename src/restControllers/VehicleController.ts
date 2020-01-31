import { NextFunction, Request, Response } from "express";
import { VehicleDao } from "../daos/VehicleDao";
import {  } from "../daos/UserDaos";
import { VehicleReg } from "../entities/VehicleReg";
import { Role } from "../entities/User";
import { getPayloadFromResponse } from "../utils/authUtils";
import { genericTextLenghtValidation } from "../utils/validationUtils";

export class VehicleController {

    private dao = new VehicleDao()

    // let x = {a: 1, b: 2, c: 3, z:26};
    // let {b, ...y} = x;
    // b ==2
    // y == {a: 1, c: 3, z:26};

    //solo admin
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

    //controlar datos invalidos
    //obtener usuario del token, omitir si mandan uno por parametro
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