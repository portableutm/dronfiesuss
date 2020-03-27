import { NextFunction, Request, Response } from "express";
import { OperationDao } from "../daos/OperationDaos";
import { Role } from "../entities/User";
import { getPayloadFromResponse } from "../utils/authUtils";
import { VehicleDao } from "../daos/VehicleDao";
import { Operation, OperationState } from "../entities/Operation";
import { validateStringDateIso , dateTimeStringFormat } from "../utils/validationUtils"


const MIN_MIN_ALTITUDE = -300
const MAX_MIN_ALTITUDE = 0

const MIN_MAX_ALTITUDE = 0
const MAX_MAX_ALTITUDE = 400


const MIN_TIME_INTERVAL = 15 * (1000 * 60) // 15 minutos
const MAX_TIME_INTERVAL = 5 * (1000 * 60 * 60) // 5 horas

export class OperationController {

  private dao = new OperationDao()
  private daoVehiculo = new VehicleDao()

  /**
   * Return all operations, if state passed return all operations with this state
   * query params: state=OperationState 
   * @param request 
   * @param response 
   * @param next 
   */
  //solo admin   
  async all(request: Request, response: Response, next: NextFunction) {
    let { role, username } = getPayloadFromResponse(response)
    if (role == Role.ADMIN) {
      let state = request.query.state
      let ops = await this.dao.all({ state: state })
      return response.json({ count: ops.length, ops })
    }
    else {
      return response.sendStatus(401)
    }

  }


  //si es admin cualquiera, si no es dueño o no existe por id 404   
  async one(request: Request, response: Response, next: NextFunction) {
    // console.log(` ---> request.params.gufi:${request.params.id}`)
    try {
      let { role, username } = getPayloadFromResponse(response)
      if (role == Role.ADMIN) {
        return response.json(await this.dao.one(request.params.id));
      } else {
        let v = await this.dao.oneByCreator(request.params.id, username);
        return response.json(v)
      }
    } catch (error) {
      return response.sendStatus(404)
    }
  }

  /**
   * invalid data: especificar cual esta mal > no guardo en BD
   * 
   * @param request 
   * @param response 
   * @param next 
   */
  async save(request: Request, response: Response, next: NextFunction) {
    let { username, role } = response.locals.jwtPayload
    let errors = validateOperation(request.body)
    try {
      for (let index = 0; index < request.body.uas_registrations.length; index++) {
        const element = request.body.uas_registrations[index];
        let veh = await this.daoVehiculo.oneByUser(element, username)
        request.body.uas_registrations[index] = veh
      }

    } catch (error) {
      // response.status(400)
      // return response.json(`Error with vehicle.`)
      errors.push(`The selected vehicle doesn't exists or you no are the owner.`)
    }
    request.body.creator = username
    request.body.state = OperationState.PROPOSED

    /**
     * interesccion con otras operaciones
     * interseccion con UVR
     */
    let op_vols = request.body.operation_volumes
    let error = false
    // if (op_vols !== undefined) {
    //   for (let index = 0; index < op_vols.length; index++) {
    //     const element = op_vols[index];
    //     let intersect = await this.checkIntersection(element)
    //     if (intersect) {
    //       error = true
    //     }
    //   }
    // }
    if (errors.length == 0) {
      return response.json(await this.dao.save(request.body));
    } else {
      response.status(400)
      return response.json(errors)
    }
    // if (error) {
    //   return response.json({ "Error": `The operation registrated intersect with an other operation` })
    // } else {
    //   return response.json(await this.dao.save(request.body)); 
    // }
  }



  async getOperationByPoint(request: Request, response: Response, next: NextFunction) {
    return response.json(await this.dao.getOperationByPoint(request.body))
  }

  async getOperationByVolumeOperation(request: Request, response: Response, next: NextFunction) {
    return response.json(await this.dao.getOperationByVolume(request.body))
  }

  // AGREGAR GET OPERATIONS BY USER, a partir del token
  async operationsByCreator(request: Request, response: Response, next: NextFunction) {
    // let state = request.query.state;
    let { username, role } = response.locals.jwtPayload
    console.log(` ------------------ operationsByCreator ${username} ------------`)
    let ops;

    // if(role == Role.PILOT){
    ops = await this.dao.operationsByCreator(username)
    // }else{
    //   ops = await this.dao.all()
    // }
    return response.json({ count: ops.length, ops });
  }

  async checkIntersection(operationVolume) {
    try {
      let operationsCount = await this.dao.getOperationVolumeByVolumeCount(operationVolume)
      return operationsCount > 0;
    } catch (e) {
      console.log(e)
      return true //TODO throw exception
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let opToRemove //= await this.dao.one(request.params.id);
    // let { username, role } = response.locals.jwtPayload

    try {
      let { role, username } = getPayloadFromResponse(response)
      if (role == Role.ADMIN) {
        opToRemove = await this.dao.one(request.params.id);
      } else {
        opToRemove = await this.dao.oneByCreator(request.params.id, username);
      }
      console.log(`Will remove the operation ${opToRemove.gufi}`)
      let removedOperation = await this.dao.removeOperation(opToRemove)
      console.log(`Removed the operation ${removedOperation.gufi}`)
      return response.json(removedOperation)
    } catch (error) {
      return response.sendStatus(404)
    }

  }
  // async remove(request: Request, response: Response, next: NextFunction) {
  //     // let userToRemove = await this.dao.one(request.params.id);
  //     await this.dao.remove(request.params.username);
  // }

}


function validateOperation(operation: any) {
  let errors = []
  // let op: Operation = operation
  let op = operation
  if (op.operation_volumes.length != 1) {
    errors.push(`Operation must have only 1 volume and has ${op.operation_volumes.length}`)
  }
  for (let index = 0; index < op.operation_volumes.length; index++) {
    const element = op.operation_volumes[index];
    if (!(element.min_altitude >= MIN_MIN_ALTITUDE)) {
      errors.push(`Min altitude must be greater than ${MIN_MIN_ALTITUDE} and is ${element.min_altitude}`)
    }
    if (!(element.min_altitude <= MAX_MIN_ALTITUDE)) {
      errors.push(`Min altitude must be lower than ${MAX_MIN_ALTITUDE} and is ${element.min_altitude}`)
    }
    if (!(element.max_altitude >= MIN_MAX_ALTITUDE)) {
      errors.push(`Max altitude must be greater than ${MIN_MAX_ALTITUDE} and is ${element.max_altitude}`)
    }
    if (!(element.max_altitude <= MAX_MAX_ALTITUDE)) {
      errors.push(`Max altitude must be lower than ${MAX_MAX_ALTITUDE} and is ${element.max_altitude}`)
    }
    const effectiveTimeBeginValid = validateStringDateIso(element.effective_time_begin)
    if(!effectiveTimeBeginValid){
      errors.push(`effective_time_begin ${element.effective_time_begin} must have the format ${dateTimeStringFormat}`)
    }
    const effectiveTimeEndValid = validateStringDateIso(element.effective_time_end)
    if(!effectiveTimeEndValid){
      errors.push(`effective_time_end ${element.effective_time_end} must have the format ${dateTimeStringFormat}`)
    }
    let effective_time_begin = new Date(element.effective_time_begin)
    let effective_time_end = new Date(element.effective_time_end)
    let difference = effective_time_end.getTime() - effective_time_begin.getTime()
    if (difference <= 0) {
      errors.push(`effective_time_begin ${element.effective_time_begin} must be lower than effective_time_end ${element.effective_time_end}`)
    } else
      if (difference < MIN_TIME_INTERVAL) {
        errors.push(`The time interval must be greater than ${MIN_TIME_INTERVAL / 60 / 1000} min and is ${difference / 60 / 1000} min`)
      } else
        if (difference > MAX_TIME_INTERVAL) {
          errors.push(`The time interval must be lower than ${MAX_TIME_INTERVAL / 60 / 1000 / 60} hours and is ${roundWithDecimals(difference / 60 / 1000 / 60)} hours`)
        }
  }
  return errors
}

function roundWithDecimals(num) {
  return Math.round(num * 100) / 100
}
