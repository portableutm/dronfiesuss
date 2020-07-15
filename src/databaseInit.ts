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

import { Users, getUserListAsMap } from './data/users_data';
import { Vehicles } from "./data/vehicle_data";
import { UtmMessages } from "./data/utmMessage_data";
import { Operations as ops } from "./data/operations_data";
import { Positions } from "./data/position_data";
import { NotamsList } from "./data/notams_data";
import { RestrictedFlightVolumeList  } from "./data/rfv_data";
import { uasVolumeReservationList } from "./data/uasVolumeReservation_data";
import { deepCopy } from './utils/entitiesUtils';
import { Notams } from './entities/Notams';
import { RestrictedFlightVolume } from './entities/RestrictedFlightVolume';


let Operations = deepCopy(ops)

let debug = false


let randomFromList = (list: any[]): any => {
    return list[Math.floor(Math.random() * list.length)];
}

export async function initData(connection: Connection, callback?: () => any) {
    try {

        console.log("***************** CONF *****************")
        console.log(connection.options)
        console.log(`::CONN:: name:${connection.options.name} database:${JSON.stringify(connection.options.database)} extra:${JSON.stringify(connection.options.extra)} `)
        console.log("***************** CONF *****************")
        let vehicleDao = new VehicleDao();
        let operationDao = new OperationDao();

        let users = await connection.manager.find(User);
        if (users.length == 0) {
            if(debug) console.log("Loading Users")

            for (let index = 0; index < Users.length; index++) {
                const user = Users[index];
                try {
                    await connection.manager.save(connection.manager.create("User", user))
                } catch (error) {
                    console.error(error)
                }
            }
            const vehicles: VehicleReg[] = await vehicleDao.all();
            if (vehicles.length == 0) {
                if(debug) console.log("Loading vehicles")

                users = await connection.manager.find(User);
                // // console.log(`Loading vehicles: largo de usuarios ${users.length}`)
                // users.sort(function (a, b) {
                //     return a.username.localeCompare(b.username);
                // }); 
                let userMap = getUserListAsMap(users)
                // console.log("userMap")
                // console.log(userMap)

                Vehicles.forEach(async (vehicle, idx) => { 
                    let number = parseInt((vehicle.vehicleName.match(/\d+/g))[0])
                    // let user: User = users[number%2?0:1] 
                    let user: User = number%2 ? userMap['MaurineFowlie'] : userMap['MonroBhatia']
                    // console.log("ooooooooo")
                    
                    vehicle.registeredBy = user
                    vehicle.owner = user
                    // console.log(vehicle)
                    try {
                        let v = await connection.manager.save(connection.manager.create("VehicleReg", vehicle))
                        // console.log(">>>>>>>")
                        // console.log(v)
                    } catch (error) {
                        console.error(error)
                    }

                })
                if(debug) console.log("Finish vehicles")
            }
        }

        let operations
        try {
            operations = await operationDao.all();
        } catch (error) {
            console.log(error)
        }
        
        if (operations.length == 0) {
            if(debug) console.log("Loading operations")
            let vehicles: VehicleReg[] 
            let users
            try {
                vehicles = await vehicleDao.all();
                users = await connection.manager.find(User);
                users.sort(function (a, b) {
                    return a.username >= b.username;
                });
            } catch (error) {
                console.log(error)
            }

            // console.log(`Vehicles: ${vehicles.length}`)
            // console.log(`Users: ${users.length}`)
            let userMap = getUserListAsMap(users)
            Operations[0].owner = userMap['MaurineFowlie']
            Operations[0].creator = userMap['admin']
            Operations[1].owner = userMap['admin']
            Operations[1].creator = userMap['admin']
            Operations[2].owner = userMap['MaurineFowlie']
            Operations[2].creator = userMap['admin']
            Operations[3].owner = userMap['MonroBhatia']
            Operations[3].creator = userMap['admin']

            for (let index = 0; index < Operations.length; index++) {
                const op : Operation = Operations[index];
                // let op: Operation = Operations[0]
                // op.creator = users[index] //randomFromList(users)
                op.uas_registrations = [vehicles[index]] //[randomFromList(vehicles)]

                try {
                    // connection.manager.save(connection.manager.create("Operation", op));
                    let newOp = await operationDao.save(op);
                    console.log(`New op ${index}: ${JSON.stringify(newOp)}`)
                } catch (error) {
                    console.error(error)
                }
            }
            if(debug) console.log("Finish operations")
            
        }

        
        try {
            if(debug) console.log("Loading notams ")
            let ntms = await connection.manager.find(Notams)
            if (ntms.length == 0) {
                NotamsList.forEach(async (ntm) => {
                    await connection.manager.save(Notams, ntm)
                })
            }
            if(debug) console.log("Finish notams")
        } catch (error) {
            console.log(`Error when load notams ${JSON.stringify(error)}`)
        }

        let messages = await connection.manager.find(UTMMessage)
        if (messages.length == 0) {
            if(debug) console.log("Loading utmMessages")
            UtmMessages.forEach(async (utmMessage) => {
                await connection.manager.save(UTMMessage, utmMessage)
            })
            if(debug) console.log("Finish utmMessages")
        }

        let uasVolumeReservations = await connection.manager.find(UASVolumeReservation)
        if (uasVolumeReservations.length == 0) {
            if(debug) console.log("loading UVRs")
            uasVolumeReservationList.forEach(async (uasVolumeReservation) => {
                await connection.manager.save(UASVolumeReservation, uasVolumeReservation)
            })
            if(debug) console.log("Finish Uvrs")
        }

        let restrictedFlightVolumes = await connection.manager.find(RestrictedFlightVolume)
        if (restrictedFlightVolumes.length == 0) {
            if(debug) console.log("loading UVRs")
            RestrictedFlightVolumeList.forEach(async (rfv) => {
                // console.log(rfv)
                let salida = await connection.manager.save(RestrictedFlightVolume, rfv)
                // console.log(salida)
            })
            if(debug) console.log("Finish Uvrs")
        }

        let positions = await connection.manager.find(Position)
        if (positions.length == 0) {
            if(debug) console.log("Loading position")

            let operations = await connection.manager.find(Operation);

            Positions.forEach(async (position) => {
                position.gufi = operations[0]
                await connection.manager.save(Position, position)
            })
            if(debug) console.log("Finish positions")

        }

        console.log("Finish load data")
        if (callback !== undefined) {
            callback()
        }
    } catch (error) {
        console.error(error)
    }
}
