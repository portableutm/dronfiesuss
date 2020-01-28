import { UTMMessage, Severity } from "../entities/UTMMessage";

const enumValues = Object.keys(Severity)
  .map(n => Number.parseInt(n))
  .filter(n => !Number.isNaN(n))

function getRandomSeverety() : Severity{
    // return Severity.EMERGENCY
    const randomIndex = Math.floor(Math.random() * enumValues.length)
    return Severity.INFORMATIONAL
    // return enumValues[randomIndex]
}
  

let nums = Array.from(Array(20).keys()) //[1,2,3,4,5,6,7,8,9] 

export const UtmMessages : UTMMessage[] = nums.map(num => {
    let utmMessage : UTMMessage = {
        severity: getRandomSeverety(),
        uss_name: "DronfiesUSS",
        time_sent: (new Date()).toISOString(),
        message_type: "OPERATION_CONFORMING",
        free_text: "Texto libre"
    }
    return utmMessage
})