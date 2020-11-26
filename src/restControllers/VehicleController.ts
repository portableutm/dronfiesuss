import { NextFunction, Request, Response } from "express";
import { VehicleDao } from "../daos/VehicleDao";
import { UserDao } from "../daos/UserDaos";
import { VehicleReg } from "../entities/VehicleReg";
import { Role } from "../entities/User";
import { getPayloadFromResponse } from "../utils/authUtils";
import { genericTextLenghtValidation } from "../utils/validationUtils";
import { generateNewVehicleMailHTML, generateNewVehicleMailText, generateAuthorizeVehicleMailHTML, generateAuthorizeVehicleMailText } from "../utils/mailContentUtil";
import { sendMail } from "../services/mailService";
import { multipleFiles, singleFile, getUrl} from "../services/uploadFileService";


import { adminEmail } from "../config/config";


export class VehicleController {

    private dao = new VehicleDao()

    /**
     * Get vehicles, if user role is admin get all vehicles, if user is Pilot get only the owned vehicles
     * @param request 
     * @param response 
     * @param next 
     */
    async all(request: Request, response: Response, next: NextFunction) {
        let { role, username } = getPayloadFromResponse(response)
        let vehicles
        if (role == Role.ADMIN) {
            vehicles = await this.dao.all();
        } else {
            vehicles = await this.dao.allByUser(username);
            // return response.sendStatus(401)
        }
        return response.json(vehicles)
    }

    /**
    * Get vehicles, that the user is operator
    * @param request 
    * @param response 
    * @param next 
    */
    async allVehiclesOperator(request: Request, response: Response, next: NextFunction) {
        let { role, username } = getPayloadFromResponse(response)
        let vehicles
        vehicles = await this.dao.vehiclesByOperator(username);

        return response.json(vehicles)
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
            }

        } catch (error) {
            return response.sendStatus(404)
        }


    }

    // /**
    //  * Save the vehicle passed in post
    //  * @example {
    //  *     "nNumber": "",
    //  *     "faaNumber": "faaNumber_81128",
    //  *     "vehicleName": "vehicle_name828",
    //  *     "manufacturer": "PIXHAWK",
    //  *     "model": "model_828",
    //  *     "class": "Fixed wing",
    //  *     "accessType": "",
    //  *     "vehicleTypeId": "",
    //  *     "org-uuid": "",
    //  *     "registeredBy": "userX"
    //  * }
    //  * @param request 
    //  * @param response 
    //  * @param next 
    //  */
    // async save(request: Request, response: Response, next: NextFunction) {

    //     console.log(`Mime type:${response.getHeader('content-type')}`)
    //     let { role, username } = getPayloadFromResponse(response)
    //     try {
    //         let v = request.body //: VehicleReg = await this.dao.save(request.body);
    //         v.date = undefined
    //         v.registeredBy = { username: username }
    //         if (v.owner_id) {
    //             v.owner = { username: v.owner_id }
    //             delete v.owner_id
    //         }
    //         let errors = await validateVehicle(v)
    //         if (errors.length == 0) {

    //             if ((v.dinacia_vehicle != undefined) && !v.dinacia_vehicle.caa_registration) {
    //                 v.dinacia_vehicle.caa_registration = await generateCaaRegistration(this.dao)
    //             }

    //             //insert vehicle
    //             let insertedVehicle = await this.dao.save(v)
    //             try {
    //                 sendMail([adminEmail], "Vehículo nuevo", generateNewVehicleMailText(v), generateNewVehicleMailHTML(v))
    //             } catch (error) {

    //             }
    //             return response.json(insertedVehicle);
    //         } else {
    //             response.status(400)
    //             return response.json(errors)
    //         }
    //     } catch (error) {
    //         console.error(error)
    //         response.sendStatus(400)
    //     }
    // }

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
    async save(request /*: Request */, response: Response, next: NextFunction) {

        // console.log(`Mime type:${request.headers['content-type']}`)

        let dao = this.dao
        try {
            let upload = singleFile("serial_number_file")
            upload(request, response, async function (err) {
                console.log(`File:${request.file}`)
                // console.log(request)
                try {
                    let { role, username } = getPayloadFromResponse(response)

                    let dinaciaVehicle
                    if(request.body.dinacia_vehicle_str){
                        dinaciaVehicle = JSON.parse(request.body.dinacia_vehicle_str )
                    }
                    let operators
                    if(request.body.operators_str){
                        operators = JSON.parse(request.body.operators_str)
                    }
                    delete request.body.dinacia_vehicle_str

                    if(request.file){
                        dinaciaVehicle.serial_number_file_path = getUrl(request.file.filename)
                    }

                    let v = JSON.parse(JSON.stringify(request.body)) //: VehicleReg = await this.dao.save(request.body);
                    v.dinacia_vehicle = dinaciaVehicle
                    v.operators = operators
                    
                    delete v.date
                    
                    v.registeredBy = { username: username } //AGREGAR

                    if (v.owner_id) {
                        v.owner = { username: v.owner_id }
                        delete v.owner_id
                    }
                    let errors = await validateVehicle(v)
                    if (errors.length == 0) {

                        if ((v.dinacia_vehicle != undefined) && !v.dinacia_vehicle.caa_registration) {
                            if(v.dinacia_vehicle.year == undefined){
                                // console.log(`Fecha::${v.dinacia_vehicle.year} -> ${new Date().getFullYear()}`)
                                v.dinacia_vehicle.year = new Date().getFullYear()
                            }
                            v.dinacia_vehicle.caa_registration = await generateCaaRegistration(dao, v.dinacia_vehicle.year)
                        }

                        //insert vehicle
                        let insertedVehicle = await dao.save(v)
                        try {
                            sendMail([adminEmail], "Vehículo nuevo", generateNewVehicleMailText(v), generateNewVehicleMailHTML(v))
                        } catch (error) {

                        }
                        return response.json(insertedVehicle);
                    } else {
                        response.status(400)
                        return response.json(errors)
                    }
                } catch (error) {
                    console.error(error)
                    response.sendStatus(400)
                }
            })
        } catch (error) {
            response.status(500)
            return response.json(error)
        }



    }



    /**
     * Change the status of user with username passed and status.token 
     * @example {
     *  id: string
     * }
     * @param request 
     * @param response 
     * @param next 
     */
    async authorizeVehicle(request: Request, response: Response, next: NextFunction) {
        try {
            // console.log(`authorizeVehicle::${JSON.stringify(request.body, null, 2)}`)
            let { role, username } = getPayloadFromResponse(response)
            if (role == Role.ADMIN) {
                let uvin = request.body.id || request.body.uvin
                let authorizedStatus = request.body.status
                let v = await this.dao.one(uvin);
                v.authorized = authorizedStatus
                // v.authorized = true
                let updated = await this.dao.save(v)
                sendMail([v.owner.email], "Información sobre authorización", generateAuthorizeVehicleMailText(v), generateAuthorizeVehicleMailHTML(v))
                return response.json(updated)
            } else {
                return response.sendStatus(401)
            }
        } catch (error) {
            return response.sendStatus(404)
        }
    }

}


async function validateVehicle(v: VehicleReg) {
    let errors = []
    if (!genericTextLenghtValidation(v.vehicleName)) {
        errors.push("Invalid vehicle name")
    }
    let userDao = new UserDao()

    try {
        let u = await userDao.one(v.owner.username)
    } catch (error) {
        errors.push(`The owner ${v.owner.username} does not exists`)
    }

    if (v.operators) {
        for (let index = 0; index < v.operators.length; index++) {
            const usOperator = v.operators[index];
            try {
                // console.log("operator " + usOperator.username)
                let u = await userDao.one(usOperator.username)
            } catch (error) {
                // console.log("entro?")
                errors.push(`The operator ${usOperator.username} does not exists`)
            }
        }
    }
    return errors
}

async function generateCaaRegistration(dao: VehicleDao, year) {

    // let year = new Date().getFullYear();
    let count = await dao.countDinaciaVehiclesByYear(year)
    let caa_register = `CX-${year}-${count + 1}`
    return caa_register
}
