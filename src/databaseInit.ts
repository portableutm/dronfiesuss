import { createConnection, Connection } from 'typeorm';

import {User} from "./entities/User";
import { Operation, OperationState, OperatonFaaRule } from "./entities/Operation";
import { VehicleDao } from "./restControllers/vehicleSimpleDao";
import { VehicleReg } from "./entities/VehicleReg";
import { OperationDao } from "./daos/OperationDaos";
import { OperationVolume } from './entities/OperationVolume';
import { Polygon } from 'geojson';
import { UTMMessage } from "./entities/UTMMessage";
import { Users } from './data/users_data';
import { Vehicles } from "./data/vehicle_data";

let randomFromList = (list : any[]) : any => {
    return list[Math.floor(Math.random() * list.length)];
}

export async function initData(connection: Connection, callback ? : () => any) {
    try {
        let vehicleDao = new VehicleDao();

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



        // let operations
        // try {
        //     operations = await connection.manager.find(Operation)
        // } catch (error) {
        //     console.error(error)
        // }

        let operations = await connection.manager.find(Operation)
        if (operations.length == 0) {
            console.log("Loading operations ")
            let vehicles: VehicleReg[] = await vehicleDao.all();
            let users = await connection.manager.find(User);

            let op: Operation = new Operation()
            op.flight_comments = "Test operation for rescue"
            op.volumes_description = "Simple polygon"
            op.flight_number = "12345678"
            op.submit_time = "2019-12-11T19:59:10Z"
            op.update_time = "2019-12-11T19:59:10Z"
            op.faa_rule = OperatonFaaRule.PART_107;
            op.state = OperationState.PROPOSED
            op.contact = randomFromList(users)
            op.uas_registrations = [randomFromList(vehicles)]

            op.operation_volumes = new Array < OperationVolume > ();
            op.operation_volumes[0] = new OperationVolume()
            op.operation_volumes[0].effective_time_begin = "2019-12-11T19:59:10Z"
            op.operation_volumes[0].effective_time_end = "2019-12-11T20:59:10Z"
            op.operation_volumes[0].min_altitude = 10
            op.operation_volumes[0].max_altitude = 70
            const polygon: Polygon = {
                type: "Polygon",
                coordinates: [
                    [
                        [-56.16361141204833, -34.90682134107926],
                        [-56.163225173950195, -34.911255687582056],
                        [-56.15453481674194, -34.91389506584019],
                        [-56.15406274795532, -34.909020947652444],
                        [-56.16361141204833, -34.90682134107926]
                    ]
                ]
            };
            op.operation_volumes[0].operation_geography = polygon
            op.operation_volumes[0].beyond_visual_line_of_sight = true

            op.operation_volumes[1] = new OperationVolume()
            op.operation_volumes[1].effective_time_begin = "2019-12-11T19:59:10Z"
            op.operation_volumes[1].effective_time_end = "2019-12-11T20:59:10Z"
            op.operation_volumes[1].min_altitude = 10
            op.operation_volumes[1].max_altitude = 70
            op.state = OperationState.PROPOSED //"PROPOSED"
            const polygons: Polygon = {
                type: "Polygon",
                coordinates: [
                    [
                        [-56.16361141204833, -34.90682134107926],
                        [-56.163225173950195, -34.911255687582056],
                        [-56.15453481674194, -34.91389506584019],
                        [-56.15406274795532, -34.909020947652444],
                        [-56.16361141204833, -34.90682134107926]
                    ]
                ]
            };
            op.operation_volumes[1].operation_geography = polygons
            op.operation_volumes[1].beyond_visual_line_of_sight = true


            connection.manager.save(connection.manager.create("Operation", op));
            
        }

        if (callback !== undefined) {
            callback()
        }
    } catch (error) {
        console.error(error)
    }
}
