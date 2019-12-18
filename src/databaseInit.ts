import { createConnection, Connection } from 'typeorm';

import {User} from "./entities/User";
import { Operation } from "./entities/Operation";
import { VehicleDao } from "./restControllers/vehicleSimpleDao";
import { VehicleReg } from "./entities/VehicleReg";
import { OperationDao } from "./daos/OperationDaos";
import { OperationVolume } from './entities/OperationVolume';
import { Polygon } from 'geojson';
import { UTMMessage } from "./entities/UTMMessage";

export async function initData(connection : Connection, callback?:()=>any){
    let vehicleDao = new VehicleDao();
    const vehicles : VehicleReg[] = await vehicleDao.all();
    if(vehicles.length == 0){
        console.log("Loading vehicles")
    
        await connection.manager.save(connection.manager.create(VehicleReg, {
            model: "Mavic Pro",
            manufacturer: "DJI",
            vehicleName: "Dron de desarrollo",
            registeredBy: "Emiliano Alonzo"
        }));
    
        await connection.manager.save(connection.manager.create(VehicleReg, {
            model: "Phantom 4",
            manufacturer: "DJI",
            vehicleName: "Dron de desarrollo",
            registeredBy: "Emiliano Alonzo"
        }));
    }
    
    let users = await connection.manager.find(User);
    if(users.length == 0){
        console.log("Loading users")
        // insert new users for test
        await connection.manager.save(connection.manager.create("User", {
            firstName: "Timber",
            lastName: "Saw",
            age: 27
        }));
        await connection.manager.save(connection.manager.create("User", {
            firstName: "Phantom",
            lastName: "Assassin",
            age: 24
        }));
    }

    let operations = await connection.manager.find(Operation)
    // console.log(`Operations ${operations.length}`)
    if(operations.length == 0){
        let op : Operation = new Operation()
        op.flight_comments = "Test operation for rescue"
        op.volumes_description = "Simple polygon"
        op.flight_number = "12345678"
        op.operation_volume = new OperationVolume()
        op.operation_volume.effective_time_begin = "2019-12-11T19:59:10Z"
        op.operation_volume.effective_time_end = "2019-12-11T20:59:10Z"
        op.operation_volume.min_altitude = 10
        op.operation_volume.max_altitude = 70
        op.state = "PROPOSED"
        const polygon: Polygon = {
            type: "Polygon",
            coordinates: [[[-56.16361141204833,-34.90682134107926],[-56.163225173950195,-34.911255687582056],[-56.15453481674194,-34.91389506584019],[-56.15406274795532,-34.909020947652444],[-56.16361141204833,-34.90682134107926]]]
        };
        op.operation_volume.operation_geography  = polygon
        op.operation_volume.beyond_visual_line_of_sight = true
        connection.manager.save(connection.manager.create("Operation", op));
    }

    let opDao = new OperationDao();
    let operation_volume = new OperationVolume()
    operation_volume.effective_time_begin = "2019-12-11T21:59:10Z"
    operation_volume.effective_time_end = "2019-12-11T22:59:10Z"
    operation_volume.min_altitude = 90
    operation_volume.max_altitude = 100
    const polygon: Polygon = {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -56.16494178771972,
              -34.905184795559876
            ],
            [
              -56.16168022155762,
              -34.9083170799602
            ],
            [
              -56.15906238555908,
              -34.906135051768
            ],
            [
              -56.16198062896728,
              -34.90444569979538
            ],
            [
              -56.16494178771972,
              -34.905184795559876
            ]
          ]
        ]
      };
    operation_volume.operation_geography  = polygon
    operation_volume.beyond_visual_line_of_sight = true

    if(callback!==undefined){callback()}

    // console.log("primera prueba", await opDao.getOperationByVolume(operation_volume))



    // let utmmsg : UTMMessage = new UTMMessage()
    // utmmsg.message_type =  "UNPLANNED_LANDING"
    // utmmsg.discovery_reference = "Dis"
    // utmmsg.uss_name = "Dronfies"
    // connection.manager.save(connection.manager.create("UTMMessage", utmmsg));

    
    
    


    
    // let testEntity = new TestEntity()
    // testEntity.tDate = new Date().toDateString()
    // testEntity.tTimestamp = new Date().toString()
    // await connection.manager.save(connection.manager.create("TestEntity", testEntity));
    // console.log("**** *** ** *")
    // let testEntities = await connection.manager.find(TestEntity);
    // console.log(testEntities)



}
