// var moment = require('moment-timezone');
import  * as moment  from "moment-timezone";
let localTimeZone = "America/Montevideo"

export function getLocalTime(timeUTC){
    // return moment.tz(operation.operation_volumes[0].effective_time_begin, "America/Montevideo").
    return moment.tz(timeUTC, localTimeZone).toLocaleString()
}


// <tr><td>Comienzo </td><td>${moment.tz(operation.operation_volumes[0].effective_time_begin, "America/Montevideo").to }</td></tr>
//      <tr><td>Fin</td><td>${moment.tz(operation.operation_volumes[0].effective_time_end, "America/Montevideo").format()}</td></tr>