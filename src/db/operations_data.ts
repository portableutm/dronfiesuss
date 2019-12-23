import { createConnection, Connection } from 'typeorm';
import { Polygon } from 'geojson';

import {User} from "../entities/User";
import { Operation, OperationState } from "../entities/Operation";
import { VehicleDao } from "../restControllers/vehicleSimpleDao";
import { VehicleReg } from "../entities/VehicleReg";
import { OperationDao } from "../daos/OperationDaos";
import { OperationVolume } from '../entities/OperationVolume';
import { UTMMessage } from "../entities/UTMMessage";


let op1 : Operation = new Operation()
op1.flight_comments = "Test operation for rescue"
op1.volumes_description = "Simple polygon"
op1.flight_number = "12345678"
op1.operation_volume = new OperationVolume()
op1.operation_volume.effective_time_begin = "2019-12-11T19:59:10Z"
op1.operation_volume.effective_time_end = "2019-12-11T20:59:10Z"
op1.operation_volume.min_altitude = 10
op1.operation_volume.max_altitude = 70
op1.state = OperationState.PROPOSED 
const polygon: Polygon = {
    type: "Polygon",
    coordinates: [[[-56.16361141204833,-34.90682134107926],[-56.163225173950195,-34.911255687582056],[-56.15453481674194,-34.91389506584019],[-56.15406274795532,-34.909020947652444],[-56.16361141204833,-34.90682134107926]]]
};
op1.operation_volume.operation_geography  = polygon
op1.operation_volume.beyond_visual_line_of_sight = true







