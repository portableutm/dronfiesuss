import { NextFunction, Request, Response } from "express";
import { OperationDao } from "../daos/OperationDaos";
import { Role, User } from "../entities/User";
import { RestrictedFlightVolume } from "../entities/RestrictedFlightVolume";
import { getPayloadFromResponse } from "../utils/authUtils";
import { operationMailHtml } from "../utils/mailContentUtil";
import { UASVolumeReservationDao } from "../daos/UASVolumeReservationDao";
import { RestrictedFlightVolumeDao } from "../daos/RestrictedFlightVolumeDao";
import { Operation, OperationState } from "../entities/Operation";
import { sendMail } from "../services/mailService";
import { frontEndUrl } from "../config/config";
import { logError, logInfo } from "../services/logger";


import { sendOpertationStateChange, sendNewOperation } from "../services/asyncBrowserComunication";


export class MailController {

  private dao = new OperationDao()

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
    // console.log(` ---> SEND-MAIL-FOR-PENDING-OPERATION:${JSON.stringify(request.body)}`)

    try {
      // let error = false

      let error = await doSendMailForPendingOperation(this.dao, { receiverMail, gufi, bodyMail }, { role, username })
      if (error) {
        return response.sendStatus(401)
      } else {
        return response.json({ status: "ok" })
      }
    } catch (error) {
      // console.error(error)
      return response.sendStatus(400)
    }
  }

  async sendOperationMail(request: Request, response: Response, next: NextFunction) {
    let { role, username } = getPayloadFromResponse(response)
    let { receiverMail, gufi, bodyMail } = request.body
    try {

      let error = await doSendMailForOperation(this.dao, { receiverMail, gufi, bodyMail }, { role, username })
      if (error) {
        return response.sendStatus(401)
      } else {
        return response.json({ status: "ok" })
      }
    } catch (error) {
      // console.error(error)
      return response.sendStatus(400)
    }
  }
}



//FIXME the methods below must go to other files like mailUtils.js

export const doSendMailForPendingOperation = async (dao: OperationDao, { receiverMail, gufi, bodyMail }, { role, username }) => {
  if (role == Role.ADMIN) {
    let operation = <Operation>await dao.one(gufi);

    let rfvs = []
    const rfvDao = new RestrictedFlightVolumeDao()
    for (let index = 0; index < operation.operation_volumes.length; index++) {
      const operationVolume = operation.operation_volumes[index];
      rfvs = rfvs.concat(await rfvDao.getRfvIntersections(operationVolume))
    }
    let rfvMsg = JSON.stringify(rfvs)  //rfvs.map(rfv=>JSON.stringify(rfv)).join("\n")
    logInfo(`Operation ${operation.gufi} intersect with rfs: ${JSON.stringify(rfvs.map(rfv => rfv.id))}`)

    let subject = `Información sobre operación de dron que entro en estado pendiente`
    let body = makeBodyMail(bodyMail, operation, rfvMsg, rfvs)
    let htmlBody = makeHtmlBodyMail(bodyMail, operation, rfvMsg, rfvs)

    sendMail(receiverMail, subject, body, htmlBody)
    return false
  } else {
    return true
  }
}

export const doSendMailForOperation = async (dao: OperationDao, { receiverMail, gufi, bodyMail }, { role, username }) => {
  // TODO: Implement in PER INSTANCE configuration - pilots sending emails for no reason is BAD.
  //if (role == Role.ADMIN) {
  let operation = <Operation>await dao.one(gufi);

  let subject = `Información sobre operación`

  let htmlBody = ` <p>${bodyMail}</p>
    ${operationMailHtml(operation)}`

  // let body = makeBodyMail(bodyMail, operation, rfvMsg, rfvs)
  // let htmlBody = makeHtmlBodyMail(bodyMail, operation, rfvMsg, rfvs)

  sendMail(receiverMail, subject, htmlBody, htmlBody)
  return false
  /*} else {
    return true
  }*/
}


export const doSendMailForNotAcceptedOperation = async (dao, { receiverMail, gufi, bodyMail }, { role, username }) => {
  if (role == Role.ADMIN) {
    let operation = <Operation>await dao.one(gufi);
    const uvrDao = new UASVolumeReservationDao()

    let uvrs = []
    let operations = []
    for (let index = 0; index < operation.operation_volumes.length; index++) {
      const operationVolume = operation.operation_volumes[index];
      operations = operations.concat(await dao.getOperationVolumeByVolumeCountExcludingOneOperation(operation.gufi, operationVolume)) //FIXME it can get only the operation
      uvrs = uvrs.concat(await uvrDao.getUvrIntersections(operationVolume))
    }

    logInfo(`Operation ${operation.gufi} intersect with operations: ${JSON.stringify(operations.map(op => op.gufi))} and with UVRs: ${JSON.stringify(uvrs.map(uvr => uvr.message_id))} `)

    let subject = `Información sobre operación de dron que entro en estado no aceptado`
    let body = makeNotAcceptedTextMail(bodyMail, operation, operations, uvrs)
    let htmlBody = makeNotAcceptedHTMLMail(bodyMail, operation, operations, uvrs)

    sendMail(receiverMail, subject, body, htmlBody)
    return false
  } else {
    return true
  }
}

const makeRfvUrl = (rfvStr) => {
  const baseUrl = 'http://localhost:3000/'
  // create buffer from string
  let binaryData = Buffer.from(rfvStr, "utf8");

  // decode buffer as base64
  let base64Data = binaryData.toString("base64");
  const query = `rfvs=${base64Data}`
  return `${baseUrl}?${query}`
}


const getUrlRfv = (rfvid) => { return frontEndUrl + "rfv/" + rfvid }
const getUrlUvr = (id) => { return frontEndUrl + "uvr/" + id }

const makeBodyMail = (bodyMail, operation, rfvMsg, rfvs) => {

  return `${bodyMail}

  Información sobre la operación: ${operation.name}:
  Identificador ${operation.gufi}
  Conteacto ${operation.contact}
  Comienzo ${operation.operation_volumes[0].effective_time_begin}
  Fin ${operation.operation_volumes[0].effective_time_end}
  Altitud máxima (in meters) ${operation.operation_volumes[0].max_altitude}
  Comentarios de aeronave ${operation.aircraft_comments}
  Número de vuelo ${operation.flight_number}
  Comentarios del vuelo ${operation.flight_comments}

  La misión está a la espera de ser aprobada porque vuela en las siguientes zonas reestringidas:
  ${rfvs.map(rfv => { return `${rfv.comments} más inforamción en ${getUrlRfv(rfv.id)}` }).join("\n")}
`
}



// http://68.183.22.43/uvr/a7563257-214b-4060-a463-5e817aa3b90d
// app.portableutm.com/rfv/ID-DE-RFV
// <a href="${makeRfvUrl(rfvMsg)}">Ver Rfv con las que intersecta</a>
// <pre>${rfvMsg}</pre>



const makeHtmlBodyMail = (bodyMail, operation, rfvMsg, rfvs) => {
  return `
  <p>${bodyMail}</p>
  ${operationMailHtml(operation)}
 
<br /><p>La misión está a la espera de ser aprobada porque vuela en las siguientes zonas reestringidas:<p>
  ${rfvs.map(rfv => { return `<a href="${getUrlRfv(rfv.id)}">${rfv.comments}</a> <small>(${getUrlRfv(rfv.id)})</small>` }).join("<br />")}
`
}



const makeNotAcceptedTextMail = (bodyMail, operation, operations, uvrs) => {
  let operationText = () => {
    return `La misión no ha sido aceptada porque vuela en zonas donde ya existen las siguientes operaciones aprobadas:
    ${operations.map(op => { return `${op.name}` }).join("\n")}`
  }

  let uvrsText = () => {
    return `La misión no ha sido aceptada porque vuela en zonas donde exiten las siguientes zonas reservadas:
    ${uvrs.map(uvr => { return `${uvr.message_id} más inforamción en ${getUrlRfv(uvr.message_id)}` }).join("\n")}`
  }
  return `${bodyMail}

  Información sobre la operación: ${operation.name}:
  Identificador ${operation.gufi}
  Conteacto ${operation.contact}
  Comienzo ${operation.operation_volumes[0].effective_time_begin}
  Fin ${operation.operation_volumes[0].effective_time_end}
  Altitud máxima (in meters) ${operation.operation_volumes[0].max_altitude}
  Comentarios de aeronave ${operation.aircraft_comments}
  Número de vuelo ${operation.flight_number}
  Comentarios del vuelo ${operation.flight_comments}
  
  ${operations.length > 0 ? operationText() : ""}
  ${uvrs.length > 0 ? uvrsText() : ""}`
}

const makeNotAcceptedHTMLMail = (bodyMail, operation, operations, uvrs) => {
  let operationText = () => {
    return `<p>La misión no ha sido aceptada porque vuela en zonas donde ya existen las siguientes operaciones aprobadas:<p>
    ${operations.map(op => { return `<span>${op.name}</span>` }).join("<br />")}`
  }

  let uvrsText = () => {
    return `<p>La misión no ha sido aceptada porque vuela en zonas donde exiten las siguientes zonas reservadas:<p>
    ${uvrs.map((uvr, idx) => { return `<a href="${getUrlUvr(uvr.message_id)}">Zona ${idx + 1}</a> <small>(${getUrlUvr(uvr.message_id)})</small>` }).join("<br />")}
    `
  }

  return `<p>${bodyMail}</p>
  ${operationMailHtml(operation)}
<br />
  ${operations.length > 0 ? operationText() : ""}
  <br />
  ${uvrs.length > 0 ? uvrsText() : ""}
  `
}


