import { RestrictedFlightVolume } from "../entities/RestrictedFlightVolume";
import { Polygon } from "geojson";


let poly : Polygon = {"type":"Polygon","coordinates":[[[-56.04538,-34.816622],[-56.058598,-34.850016],[-56.04744,-34.864666],[-56.007099,-34.85396],[-55.992165,-34.828741],[-55.996971,-34.81634],[-56.016884,-34.81479],[-56.04538,-34.816622]]]}
let rfv1 : RestrictedFlightVolume = {
    id: "056ccb91-c58c-439b-93a0-592e19cba0b8",
    geography: poly,
    max_altitude: 50,
    min_altitude: 0,
    comments: "Airport MVD"
}

let poly1 : Polygon = {"type":"Polygon","coordinates":[[[-56.368103,-34.764179],[-56.386642,-34.805347],[-56.344757,-34.820568],[-56.313858,-34.795762],[-56.289825,-34.768691],[-56.368103,-34.764179]]]}
let rfv2 : RestrictedFlightVolume = {
    id: "49e3417a-ac0d-4be9-82b2-6b6b109c106b",
    geography: poly1,
    max_altitude: 100,
    min_altitude: 0,
    comments: "Natural protected zone"
}

export let RestrictedFlightVolumeList = [rfv1, rfv2]


 