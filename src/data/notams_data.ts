import { Notams } from "../entities/Notams";
import { Polygon } from "geojson";

let poly : Polygon = {"type": "Polygon","coordinates": [[[-56.16219520568848,-34.90198199920359],[-56.176958084106445,-34.91486281660613],[-56.15670204162597,-34.92696753487634],[-56.14013671875,-34.911554821381635],[-56.16133689880371,-34.915425866347164],[-56.16219520568848,-34.90198199920359]]]}
let notam1 : Notams = {
    message_id : "f2308be3-80a5-4247-964a-b541a1634331",
    text : "Helicopters search for a strange treasure",
    geography: poly,
    effective_time_begin: "2020-04-10T14:00:00Z",
    effective_time_end: "2020-04-11T14:00:00Z",
}

let poly2 : Polygon = { "type": "Polygon", "coordinates": [ [ [ -56.1386775970459, -34.89550563374408 ], [ -56.14331245422363, -34.90571271703311 ], [ -56.13387107849121, -34.90768359387805 ], [ -56.13155364990234, -34.89811032037213 ], [ -56.1386775970459, -34.89550563374408 ] ] ] }
let notam2 : Notams = {
    message_id : "1b5f39e6-11e8-4f6b-b32c-3c94bee4a892",
    text : "Planes search for a strange treasure",
    geography: poly2,
    effective_time_begin: "2020-04-11T14:00:00Z",
    effective_time_end: "2020-04-12T14:00:00Z",
}

export let NotamsList = [notam1, notam2]


 