import { app } from "../index";
import { Position } from "../entities/Position";
import { User } from "../entities/User";


function send(topic, object){
    console.log(`Sending ${JSON.stringify(object)} to ${topic}`)
    // if(process.env.NODE_ENV != "test"){
    //     app.io.emit(topic, object)
    // } else {
    //     return [topic, object]
    // }

    if(app.io != undefined) {
        app.io.emit(topic, object)
    }else{
        console.log(`app.io is undefined`)
        return [topic, object]
    }

}


export function sendPositionToMonitor(position, controller_location){
    // app.io.emit('new-position', position)
    return send('new-position', {...position, controller_location})
}

export function sendOperationFlyStatus(inOperation ){
    // app.io.emit('position-status', inOperation)
    return send('position-status', inOperation)
}

export function sendOpertationStateChange(operationInfo){
    // app.io.emit('position-status', inOperation)
    return send('operation-state-change', operationInfo)
}

export function sendNewOperation(operationInfo){
    return send('new-operation', operationInfo)
}


export function sendAlgo(position : Position){
    // app.io.emit('new-position', position)
    return send('new-position', position)
}


export function sendUserLogged(user : User){
    // app.io.emit('user-logged')
    return send('user-logged', {})
}