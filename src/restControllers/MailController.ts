import { NextFunction, Request, Response } from "express";
import { OperationDao } from "../daos/OperationDaos";
import { Role, User } from "../entities/User";
import { getPayloadFromResponse } from "../utils/authUtils";
import { VehicleDao } from "../daos/VehicleDao";
import { Operation, OperationState } from "../entities/Operation";
import { validateStringDateIso, dateTimeStringFormat } from "../utils/validationUtils"
import { UserDao } from "../daos/UserDaos";
import { ApprovalDao } from "../daos/ApprovalDao";
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

async sendMailForPendingOperation(request: Request, response: Response, next: NextFunction) {
  let { role, username } = getPayloadFromResponse(response)
  let { receiverMail, idOperation, bodyMail } = request.body
  console.log(` ---> SEND-MAIL-FOR-PENDING-OPERATION:${JSON.stringify(request.body)}`)

  // await sendMailPedingOperationFunction(request.body, getPayloadFromResponse(response))
  try {
    if (role == Role.ADMIN) {
      // let operation = <Operation>await this.dao.one(idOperation);
      let operation = {name:"Operation prueba"}
      // let subject = `Información sobre operación de dron ${operation.name}`
      let subject = `Información sobre operación de dron ${operation.name}`
      let body = makeBodyMail(bodyMail, operation)
      let htmlBody = makeHtmlBodyMail(bodyMail, operation)

      sendMail(receiverMail, subject, body, htmlBody)
      return response.json({status:"ok"})

      // return response.json(await this.dao.one(request.params.id));
    } else {
      let v = await this.dao.oneByOwner(request.params.id, username);
      return response.json(v)
    }
  } catch (error) {
    console.error(error)
    return response.sendStatus(404)
  }
}
}

export const sendMailPedingOperationFunction = async ({receiverMail, idOperation, bodyMail}, { role, username }) => {
  const dao = new OperationDao()
  if (role == Role.ADMIN) {
    let operation = <Operation>await dao.one(idOperation);
    let subject = `Información sobre operación de dron ${operation.name}`
    let body = makeBodyMail(bodyMail, operation)
    let htmlBody = makeHtmlBodyMail(bodyMail, operation)

    sendMail(receiverMail, subject, body, htmlBody)
    // return response.json(await this.dao.one(request.params.id));
  } 
  // else {
  //   let v = await dao.oneByOwner(idOperation, username);
  //   return response.json(v)
  // }
}


// function changeState(operationInfo) {
//   sendOpertationStateChange(operationInfo)
// }

const makeBodyMail = (bodyMail, operation) => {
  return `${bodyMail}
Información de operación:
${JSON.stringify(operation)}`
}


const makeHtmlBodyMail = (bodyMail, operation) => {
  return `<p>${bodyMail}</p>
  <h2>Información de operación</h2>:
  <pre>${JSON.stringify(operation)}</pre>`
}

