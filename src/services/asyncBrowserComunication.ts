import { app } from "../index";
import { Position } from "../entities/Position";
import { User } from "../entities/User";



export function sendPositionToMonitor(position ){
    app.io.emit('new-position', position)
}

export function sendOperationFlyStatus(inOperation ){
    app.io.emit('position-status', inOperation)
}


export function sendAlgo(position : Position){
    app.io.emit('new-position', position)
}


export function sendUserLogged(user : User){
    app.io.emit('user-logged')
}