import { VehicleReg, VehicleAuthorizeStatus, vehicleType } from "../entities/VehicleReg"
import { frontEndUrl } from "../config/config";


export function buildConfirmationLink(username, token, frontEndEndpoint) {
    return `${frontEndEndpoint}/verify/${username}?token=${token}`

}

export function buildConfirmationTextMail(username, link) {
    return `
    Hello ${username}, 
    Thank you for registering in PortableUTM!
    To finish the user registration process, please click in the following link.
    
    ${link}
    `
}

export function buildConfirmationHtmlMail(username, link) {
    return `
    <p>Hello ${username},</p>
    <p>Thank you for registering in PortableUTM!</p>
    <p>To finish the user registration process, please click in the following link.</p>
    <p><a href="">${link}</a></p>
    `
}



const vehicleUrl = (uvin) => {
    return `${frontEndUrl}dashboard/vehicles/${uvin}`
}
export function generateNewVehicleMailHTML(vehicle: VehicleReg) {
    return `
    <h1>Se ha registrado un nuevo vehículo</h1>
    <p> El usuario ${vehicle.owner.username}, ha registrado un vehículo con identificador ${vehicle.uvin}, 
    para más detalles y autorizar el vehículo haga click <a href="${vehicleUrl(vehicle.uvin)}">aquí</a><p>
     `
}

export function generateNewVehicleMailText(vehicle) {
    return `
    Se ha registrado un nuevo vehículo.
    El usuario ${vehicle.owner.username}, ha registrado un vehículo con identificador ${vehicle.uvin}, 
    para más detalles y autorizar el vehículo utilice el siguiente enlace ${vehicleUrl(vehicle.uvin)}
     `
}

export function generateAuthorizeVehicleMailHTML(vehicle: VehicleReg) {
    return `
    <p>El vehículo ${vehicle.vehicleName} ${vehicle.authorized == VehicleAuthorizeStatus.AUTHORIZED ? 'ha sido' : 'no ha sido'} autorizado.</p>
    <p>Para más detalles haga click <a href="${vehicleUrl(vehicle.uvin)}">aquí</a><p>
     `
}

export function generateAuthorizeVehicleMailText(vehicle: VehicleReg) {
    return `
    El vehículo ${vehicle.vehicleName} ${vehicle.authorized == VehicleAuthorizeStatus.AUTHORIZED ? 'ha sido' : 'no ha sido'} autorizado.
    Para más detalles utilice el siguiente enlace ${vehicleUrl(vehicle.uvin)}
     `
}



