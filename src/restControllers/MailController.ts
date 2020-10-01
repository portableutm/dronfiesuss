import { NextFunction, Request, Response } from "express";
import { OperationDao } from "../daos/OperationDaos";
import { Role, User } from "../entities/User";
import { getPayloadFromResponse } from "../utils/authUtils";
import { VehicleDao } from "../daos/VehicleDao";
import { Operation, OperationState } from "../entities/Operation";
import { sendMail } from "../services/mailService";

import { sendOpertationStateChange, sendNewOperation } from "../services/asyncBrowserComunication";


export class MailController {

  private dao = new OperationDao()
  private daoVehiculo = new VehicleDao()



  //   async sendMailForPendingOperation(request: Request, response: Response, next: NextFunction) {
  //     // console.log(` ---> request.params.gufi:${request.params.id}`)
  //     let { receiverMail, idOperation, bodyMail } = request.body
  //     try {
  //       await sendMailPedingOperationFunction(request.body, getPayloadFromResponse(response))
  //     } catch (error) {
  //       return response.sendStatus(404)
  //     }
  //   }
  // }

  /**
   * Send a mail to receiverMail, with the content of bodyMail and the informatio of the operation with gufi
   * @example POST /mail/pending mailData = { receiverMail: receiverMail, gufi: gufi, bodyMail: "La operació... "}
   * @param request 
   * @param response 
   * @param next 
   */
  async sendMailForPendingOperation(request: Request, response: Response, next: NextFunction) {
    let { role, username } = getPayloadFromResponse(response)
    let { receiverMail, gufi, bodyMail } = request.body
    console.log(` ---> SEND-MAIL-FOR-PENDING-OPERATION:${JSON.stringify(request.body)}`)

    try {
      if (role == Role.ADMIN) {
        let operation = <Operation>await this.dao.one(gufi);
        let subject = `Información sobre operación de dron ${operation.name}`
        console.log(` ---> SEND-MAIL-FOR-PENDING-OPERATION:${JSON.stringify(operation, null, 2)}`)
        let body = makeBodyMail(bodyMail, operation)
        let htmlBody = makeHtmlBodyMail(bodyMail, operation)

        sendMail(receiverMail, subject, body, htmlBody)
        return response.json({ status: "ok" })
      } else {
        // let v = await this.dao.oneByOwner(request.params.id, username);
        // return response.json(v)
        return response.sendStatus(400)
      }
    } catch (error) {
      console.error(error)
      return response.sendStatus(400)
    }
  }
}

// export const sendMailPedingOperationFunction = async ({ receiverMail, idOperation, bodyMail }, { role, username }) => {
//   try {
//     const dao = new OperationDao()
//     if (role == Role.ADMIN) {
//       let operation = <Operation>await dao.one(idOperation);
//       let subject = `Información sobre operación de dron ${operation.name}`
//       let body = makeBodyMail(bodyMail, operation)
//       let htmlBody = makeHtmlBodyMail(bodyMail, operation)

//       sendMail(receiverMail, subject, body, htmlBody)
//       // return response.json(await this.dao.one(request.params.id));
//     }
//     // else {
//     //   let v = await dao.oneByOwner(idOperation, username);
//     //   return response.json(v)
//     // }  
//   } catch (error) {
//   }
// }


// function changeState(operationInfo) {
//   sendOpertationStateChange(operationInfo)
// }

// Contact ${operation.contactowner.firstName} ${operation.owner.lastName}

const makeBodyMail = (bodyMail, operation) => {

  return `${bodyMail}

Información de operación ${operation.name}:
  ID ${operation.gufi}
  Contact ${operation.contact}
  Begins at ${operation.operation_volumes[0].effective_time_begin}
  Ends at ${operation.operation_volumes[0].effective_time_end}
  Maximum altitude (in meters) ${operation.operation_volumes[0].max_altitude}
  Aircraft comments ${operation.aircraft_comments}
  Flight numbe ${operation.flight_number}
  Flight comments ${operation.flight_comments}
`
}


const makeHtmlBodyMail = (bodyMail, operation) => {
  return `
  <p>${bodyMail}</p>
  <table>
 <tr colspan="2">
  <th>Información de operación ${operation.name}</th>
 </tr>
  <tr><td>ID </td><td>${operation.gufi}</td></tr>
  <tr><td>Contact </td><td>${operation.contact}</td></tr>
  <tr><td>Begins </td><td>${operation.operation_volumes[0].effective_time_begin}</td></tr>
  <tr><td>Ends </td><td>${operation.operation_volumes[0].effective_time_end}</td></tr>
  <tr><td>Maximum altitude (in meters) </td><td>${operation.operation_volumes[0].max_altitude}</td></tr>
  <tr><td>Aircraft comments </td><td>${operation.aircraft_comments}</td></tr>
  <tr><td>Flight numbe </td><td>${operation.flight_number}</td></tr>
  <tr><td>Flight comments </td><td>${operation.flight_comments}</td></tr>
</table>
  <pre>${JSON.stringify(operation, null, 2)}</pre>`
}

