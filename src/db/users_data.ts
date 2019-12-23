import { createConnection, Connection } from 'typeorm';
import { Polygon } from 'geojson';

import {User} from "../entities/User";
import { Operation, OperationState } from "../entities/Operation";
import { VehicleDao } from "../restControllers/vehicleSimpleDao";
import { VehicleReg } from "../entities/VehicleReg";
import { OperationDao } from "../daos/OperationDaos";
import { OperationVolume } from '../entities/OperationVolume';
import { UTMMessage } from "../entities/UTMMessage";

import { hashPassword } from "../services/encrypter";



let nums = [1,2,3,4,5,6,7,8,9] 
export const Users = nums.map(num => `User_${num}`).map(username => {
    let user : User = {
        username : username,
        email : `${username}@dronfies.com`,
        firstName : `name_${username}`,
        lastName : `last_${username}`,
        password : hashPassword(`${username}`)
    }
    return user
})


