import { Connection } from 'typeorm';
import { Polygon } from 'geojson';

import { VehicleDao } from "./daos/VehicleDao";
import { OperationDao } from "./daos/OperationDaos";

import { User } from "./entities/User";
import { Operation, OperationState, OperatonFaaRule } from "./entities/Operation";
import { OperationVolume } from './entities/OperationVolume';
import { VehicleReg } from "./entities/VehicleReg";
import { UTMMessage, Severity } from "./entities/UTMMessage";
import { PriorityElements } from './entities/PriorityElements';
import { ContingencyPlan } from './entities/ContingencyPlan';
import { Position } from './entities/Position';
import { UASVolumeReservation } from './entities/UASVolumeReservation';

import { Users } from './data/users_data'; 
import { Vehicles } from "./data/vehicle_data";
import { UtmMessages } from "./data/utmMessage_data";
import { Operations } from "./data/operations_data";
import { Positions } from "./data/position_data";
import { uasVolumeReservationList } from "./data/uasVolumeReservation_data";



let randomFromList = (list : any[]) : any => {
    return list[Math.floor(Math.random() * list.length)];
}

export async function initData(connection: Connection, callback ? : () => any) {
    try {
        let vehicleDao = new VehicleDao();
        let operationDao = new OperationDao();

        let users = await connection.manager.find(User);
        if (users.length == 0) {
            console.log("Loading Users")
            let savedUser = Users.map(async user => {
                try {
                    return await connection.manager.save(connection.manager.create("User", user))
                } catch (error) {
                    console.error(error)
                }
            })
            const vehicles: VehicleReg[] = await vehicleDao.all();
            if (vehicles.length == 0) {
                users = await connection.manager.find(User);
                console.log("Loading vehicles")
                Vehicles.forEach(async vehicle => {
                    let user: User = randomFromList(users)
                    vehicle.registeredBy = user
                    try {
                        await connection.manager.save(connection.manager.create("VehicleReg", vehicle))
                    } catch (error) {
                        console.error(error)
                    }

                })
            }
        }

        let operations
        try {
            // operations  = await connection.manager.find(Operation)
            operations = await operationDao.all();
        } catch (error) {
            console.log(error)            
        }
        console.log(`operations ${operations.length}`)
        if (operations.length == 0) {
            console.log(`Loading operations ${operations.length}`)
            let vehicles: VehicleReg[] 
            let users
            try {
                vehicles = await vehicleDao.all();
                users = await connection.manager.find(User);
                users.sort(function(a, b) {
                    return a.username >= b.username;
                });
            } catch (error) {
                console.log(error)            
            }

            console.log(`Vehicles: ${vehicles.length}`)
            console.log(`Users: ${users.length}`)

            for (let index = 0; index < Operations.length; index++) {
                const op = Operations[index];
                // let op: Operation = Operations[0]
                op.creator = users[index] //randomFromList(users)
                op.uas_registrations = [vehicles[index]] //[randomFromList(vehicles)]
        
                try {
                    // connection.manager.save(connection.manager.create("Operation", op));
                    let newOp = await operationDao.save(op);
                    console.log(`New op ${index}: ${JSON.stringify(newOp)}`)
                } catch (error) {
                    console.error(error)
                }
            }
           
        }

        console.log("Loading msgs ")

        let messages = await connection.manager.find(UTMMessage)
        if(messages.length==0){
            UtmMessages.forEach(async (utmMessage)=>{
                await connection.manager.save(UTMMessage, utmMessage)
            })
        }

        let uasVolumeReservations = await connection.manager.find(UASVolumeReservation)
        if(uasVolumeReservations.length==0){
            uasVolumeReservationList.forEach(async (uasVolumeReservation)=>{
                await connection.manager.save(UASVolumeReservation, uasVolumeReservation)
            })
        }

        let positions = await connection.manager.find(Position)
        if(positions.length==0){
            let operations = await connection.manager.find(Operation);

            Positions.forEach(async (position)=>{
                position.gufi = operations[0]
                await connection.manager.save(Position, position)
            })
        }


        if (callback !== undefined) {
            callback()
        }
    } catch (error) {
        console.error(error)
    }
}
