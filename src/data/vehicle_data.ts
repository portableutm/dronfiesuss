import { createConnection, Connection } from 'typeorm';

import {VehicleAuthorizeStatus, VehicleReg, vehicleType} from "../entities/VehicleReg";


let getManufacturer = (num : number) => {
    return (num % 2 == 0) ? 'DJI' : 'PIXHAWK'
}

let getClass = (num : number) => {
    const numTypes = 4
    if(num % numTypes == 0){
        return vehicleType.FIXEDWING
    }
    if(num % numTypes == 1){
        return vehicleType.MULTIROTOR
    }
    if(num % numTypes == 2){
        return vehicleType.OTRO
    }
    if(num % numTypes == 3){
        return vehicleType.VTOL
    }
    // return (num % 2 == 0) ? 'Multi rotor' : 'Fixed wing'
}

let getModel

let nums = [1,2,3,4,5,6,7,8,9] 
let ids = [
    "188d89d8-fb4f-40be-a5ee-059feca02cca",
    "1e8a387d-07ad-41b0-a908-01d2d59ac8d5",
    "1e0cbde2-88f9-4747-a2f5-966f69351876",
    "6acf14ec-8e33-4d3d-a4d9-2fa5708dcb46",
    "c7c5d017-bfa4-40de-b0ca-66e499283cea",
    "a26fdc00-8626-4b08-8b9e-5c50da12fff1",
    "4d7bc882-4420-47ea-85bc-292b1c7b0a2e",
    "32b858dd-8c63-4e99-9a18-6df064cf64cb",
    "bd9b2eb6-7ab7-442e-b99c-78890581f198",
]
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
        uvin : ids[num-1],
        trackerId: `${num}`.repeat(20),
        authorized: VehicleAuthorizeStatus.AUTHORIZED
    }
    return vehicle
})



