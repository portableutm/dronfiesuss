import { createConnection, Connection } from 'typeorm';

import {VehicleReg} from "../entities/VehicleReg";


let getManufacturer = (num : number) => {
    return (num % 2 == 0) ? 'DJI' : 'PIXHAWK'
}

let getClass = (num : number) => {
    return (num % 2 == 0) ? 'Multi rotor' : 'Fixed wing'
}

let getModel

let nums = [1,2,3,4,5,6,7,8,9] 
export const Vehicles : VehicleReg[] = nums.map(num => {
    let vehicle : VehicleReg = {
        faaNumber : `faaNumber_${num}`,
        manufacturer : getManufacturer(num),
        model : `model_${num}`,
        class : getClass(num),
        vehicleName : `vehicle_name${num}`,
        "org-uuid" : '',
        accessType : '',
        // registeredBy : '',
        vehicleTypeId : '',
        nNumber : '',
        // uvin : ''
    }
    return vehicle
})



