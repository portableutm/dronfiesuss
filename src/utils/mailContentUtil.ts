import { VehicleReg, VehicleAuthorizeStatus, vehicleType } from "../entities/VehicleReg"
import { frontEndUrl } from "../config/config";
import { User } from "../entities/User";
import { Operation } from "../entities/Operation";


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



export function operationMailHtml(operation: Operation) {
    let operationMail = `<table>
    <tr colspan="2">
     <th>Información sobre la operación: <i>${operation.name}</i></th>
    </tr>
     <tr><td>Identificador</td><td>${operation.gufi}</td></tr>
     <tr><td>Contacto</td><td>${operation.contact}</td></tr>
     <tr><td>Conteacto </td><td>${operation.contact}</td></tr>
     <tr><td>Comienzo </td><td>${operation.operation_volumes[0].effective_time_begin}</td></tr>
     <tr><td>Fin</td><td>${operation.operation_volumes[0].effective_time_end}</td></tr>
     <tr><td>Altitud máxima (m) </td><td>${operation.operation_volumes[0].max_altitude}</td></tr>
     <tr><td>Comentarios de la aeronave </td><td>${operation.aircraft_comments}</td></tr>
     <tr><td>Número de vuelo </td><td>${operation.flight_number}</td></tr>
     <tr><td>Comentarios del vuelo </td><td>${operation.flight_comments}</td></tr>
   </table>`
    let ownerStr: string = "";
    if (operation.owner) {
        ownerStr = `<table><th>Información sobre la operador <i>${operation.owner.username}</i>:</th>${userMailHtml(operation.owner)}</table>`
    }
    let vehiclesStr: string = ""
    if (operation.uas_registrations && (operation.uas_registrations.length > 0)) {
        vehiclesStr = operation.uas_registrations.reduce((prev, current) => {
            return prev.concat(`<table><th>Información sobre la vehículo:</th>${vehicleMailHtml(current)}</table>`)
        }, "")
    }
    return operationMail + ownerStr + vehiclesStr
}
export function userMailHtml(user: User) {
    return `
    <tr><td>Nombre de usuario</td><td>${user.username}</td></tr>
    <tr><td>Nombre</td><td>${user.firstName}</td></tr>
    <tr><td>Apellido</td><td>${user.lastName}</td></tr>
    <tr><td>Email</td><td>${user.email}</td></tr>
    <tr><td>Estado</td><td>${user.status.status}</td></tr>
    ${user.dinacia_user?`<tr><td>Celular</td><td>${user.dinacia_user.cellphone}</td></tr>
    <tr><td>Teléfono</td><td>${user.dinacia_user.phone}</td></tr>
    <tr><td>Fecha de expiración de licencia</td><td>${user.dinacia_user.permit_expire_date}</td></tr>`:""}
    
    `
}
export function vehicleMailHtml(vehicle: VehicleReg) {
    return `
    <tr><td>Identificador</td><td>${vehicle.uvin}</td></tr>
    <tr><td>Nombre</td><td>${vehicle.vehicleName}</td></tr>
    <tr><td>Modelo</td><td>${vehicle.model}</td></tr>
    <tr><td>Autorizado</td><td>${vehicle.authorized ? "Si" : "No"}</td></tr>

    ${vehicle.dinacia_vehicle?`
    <tr><td>Matrícula</td><td>${vehicle.dinacia_vehicle.caa_registration}</td></tr>
    <tr><td>Autorizado</td><td>${vehicle.dinacia_vehicle.authorized ? "Si" : "No"}</td></tr>

    <tr><td>Techo</td><td>${vehicle.dinacia_vehicle.ceiling}</td></tr>
    <tr><td>Color</td><td>${vehicle.dinacia_vehicle.color}</td></tr>
    <tr><td>Sistema de comunicación</td><td>${vehicle.dinacia_vehicle.communication_control_system_command_navigation_vigilance}</td></tr>
    <tr><td>Material</td><td>${vehicle.dinacia_vehicle.construction_material}</td></tr>
    <tr><td>Velocidad crucero</td><td>${vehicle.dinacia_vehicle.cruise_speed}</td></tr>
    <tr><td>Peso vacío</td><td>${vehicle.dinacia_vehicle.empty_weight}</td></tr>
    <tr><td>Combustible de motor</td><td>${vehicle.dinacia_vehicle.engine_fuel}</td></tr>
    <tr><td>Fabricante de motor</td><td>${vehicle.dinacia_vehicle.engine_manufacturer}</td></tr>
    <tr><td>Poder de motor</td><td>${vehicle.dinacia_vehicle.engine_power}</td></tr>
    <tr><td>Cantidad de baterías</td><td>${vehicle.dinacia_vehicle.engine_quantity_batteries}</td></tr>
    <tr><td>Tipo de motor</td><td>${vehicle.dinacia_vehicle.engine_type}</td></tr>
    <tr><td>Altura</td><td>${vehicle.dinacia_vehicle.height}</td></tr>
    <tr><td>Velocidad de aterrizaje</td><td>${vehicle.dinacia_vehicle.landing_speed}</td></tr>
    <tr><td>Largo</td><td>${vehicle.dinacia_vehicle.longitude}</td></tr>
    <tr><td>Mantenimiento</td><td>${vehicle.dinacia_vehicle.maintenance_inspections}</td></tr>
    <tr><td>Velocidad máxima</td><td>${vehicle.dinacia_vehicle.max_speed}</td></tr>
    <tr><td>Peso máximo</td><td>${vehicle.dinacia_vehicle.max_weight}</td></tr>
    <tr><td>Packing</td><td>${vehicle.dinacia_vehicle.packing}</td></tr>
    <tr><td>Materia aspas</td><td>${vehicle.dinacia_vehicle.propeller_material}</td></tr>
    <tr><td>Modelo aspas</td><td>${vehicle.dinacia_vehicle.propeller_model}</td></tr>
    <tr><td>Tipo de aspas</td><td>${vehicle.dinacia_vehicle.propeller_type}</td></tr>
    <tr><td>Radio de accion</td><td>${vehicle.dinacia_vehicle.radio_accion}</td></tr>
    <tr><td>Comentarios</td><td>${vehicle.dinacia_vehicle.remarks}</td></tr>
    <tr><td>Tipo de sensor</td><td>${vehicle.dinacia_vehicle.sensor_type_and_mark}</td></tr>
    <tr><td>Numero serial</td><td>${vehicle.dinacia_vehicle.serial_number}</td></tr>
    <tr><td>Tipo de aterrizaje</td><td>${vehicle.dinacia_vehicle.takeoff_method}</td></tr>
    <tr><td>Autonomía</td><td>${vehicle.dinacia_vehicle.time_autonomy}</td></tr>
    <tr><td>Uso</td><td>${vehicle.dinacia_vehicle.usage}</td></tr>





    <tr><td>Año</td><td>${vehicle.dinacia_vehicle.year}</td></tr>`

    :""}

    
    `
}
