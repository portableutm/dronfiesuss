import { Position } from "../entities/Position";
import { Operations } from "./operations_data";


let position = new Position();

position.altitude_gps = 20
position.location = {
    type: "Point",
    coordinates: [-56.16361141204833, -34.90682134107926]
};
position.time_sent = "2019-12-11T19:59:10Z"




export let Positions = [position]
