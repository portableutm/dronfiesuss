import { NextFunction, Request, Response } from "express";
import { OperationDao } from "../daos/OperationDaos";
import { Role, User } from "../entities/User";
import { getPayloadFromResponse } from "../utils/authUtils";
import { VehicleDao } from "../daos/VehicleDao";
import { Operation, OperationState } from "../entities/Operation";
import { validateStringDateIso, dateTimeStringFormat } from "../utils/validationUtils"
import { UserDao } from "../daos/UserDaos";
import { ApprovalDao } from "../daos/ApprovalDao";

import { sendOpertationStateChange, sendNewOperation } from "../services/asyncBrowserComunication";
import { OperationVolume } from "../entities/OperationVolume";


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
   * @example /operations/?state=PROPOSED
   * @param request 
   * @param response 
   * @param next 
   */
  //solo admin   
  async all(request: Request, response: Response, next: NextFunction) {
    let { role, username } = getPayloadFromResponse(response)
    let ops;
    if (role == Role.ADMIN) {
      let userDao = new UserDao()
      try {
        let user = await userDao.one(username);
        let state = request.query.state
        if (user.VolumesOfInterest) {
          ops = await this.dao.getOperationByPolygon(user.VolumesOfInterest, { state: state })
        } else {
          ops = await this.dao.all({ state: state })
        }
        // console.log('!!!!!!!!! Operations !!!!!!!!!!')
        // console.log(`**** ${JSON.stringify(ops.map(op=>{return {name:op.name, gufi:op.gufi, owner:op.owner}}), null, 2)}`)
        return response.json({ count: ops.length, ops })

      } catch (error) {
        console.error(` -_-_-_-_-_-_-_-> ${JSON.stringify(error)}`)
        return response.sendStatus(400)
      }
    }
    else {
      return response.sendStatus(401)
    }

  }



  /**
   * Return an operation associated with passed gufi and that login user is owner.
   *  If user is not the owner or is not admin return 404. 
   * @example /operation/b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63
   * @param request 
   * @param response 
   * @param next 
   */
  async one(request: Request, response: Response, next: NextFunction) {
    // console.log(` ---> request.params.gufi:${request.params.id}`)
    try {
      let { role, username } = getPayloadFromResponse(response)
      if (role == Role.ADMIN) {
        return response.json(await this.dao.one(request.params.id));
      } else {
        let v = await this.dao.oneByOwner(request.params.id, username);
        return response.json(v)
      }
    } catch (error) {
      return response.sendStatus(404)
    }
  }

  /**
   * Save the passed operation. If a vehicle is passed that vehicle must be created by the login user
   * @example
   * {
   *   "flight_comments": "Test operation for rescue",
   *   "volumes_description": "Simple polygon",
   *   "flight_number": "12345678",
   *   "faa_rule": "PART_107",
   *   "priority_elements": {
   *     "priority_level": "ALERT",
   *     "priority_status": "NONE"
   *   },
   *   "contact": "Renate Penvarden",
   *   "contingency_plans": [
   *     {
   *       "contingency_cause": [
   *         "ENVIRONMENTAL",
   *         "MECHANICAL_PROBLEM"
   *       ],
   *       "contingency_location_description": "OPERATOR_UPDATED",
   *       "contingency_polygon": {"type": "Polygon","coordinates": [[[-56.16361141204833,-34.90682134107926],[-56.163225173950195,-34.911255687582056],[-56.15453481674194,-34.91389506584019],[-56.15406274795532,-34.909020947652444],[-56.16361141204833,-34.90682134107926]]]},
   *       "contingency_response": "LANDING",
   *       "free_text": "Texto libre DE prueba",
   *       "loiter_altitude": 30,
   *       "relative_preference": 30,
   *       "relevant_operation_volumes": [
   *         1,
   *         0
   *       ],
   *       "valid_time_begin": "2019-12-11T19:59:10Z",
   *       "valid_time_end": "2019-12-11T20:59:10Z"
   *     }
   *   ],
   *   "operation_volumes": [
   *     {
   *       "effective_time_begin": "2019-12-11T19:59:10Z",
   *       "effective_time_end": "2019-12-11T20:59:10Z",
   *       "min_altitude": 0,
   *       "max_altitude": 70,
   *       "operation_geography": {"type": "Polygon","coordinates": [[[-56.16361141204833,-34.90682134107926],[-56.163225173950195,-34.911255687582056],[-56.15453481674194,-34.91389506584019],[-56.15406274795532,-34.909020947652444],[-56.16361141204833,-34.90682134107926]]]},
   *       "beyond_visual_line_of_sight": true
   *     }
   *   ],
   *   "negotiation_agreements": [
   *     {
   *       "free_text": "Esto es solo una prueba",
   *       "discovery_reference": "discovery reference",
   *       "type": "INTERSECTION",
   *       "uss_name": "dronfies",
   *       "uss_name_of_originator": "dronfies",
   *       "uss_name_of_receiver": "dronfies"
   *     },
   *     {
   *       "free_text": "(2) Esto es solo una prueba",
   *       "discovery_reference": "(2)discovery reference",
   *       "type": "REPLAN",
   *       "uss_name": "dronfies",
   *       "uss_name_of_originator": "dronfies",
   *       "uss_name_of_receiver": "dronfies"
   *     }
   *   ]
   * }
   * @param request 
   * @param response 
   * @param next 
   */
  async save(request: Request, response: Response, next: NextFunction) {
    let { role, usernameFromRequest } = response.locals.jwtPayload
    let errors = validateOperation(request.body)
    let username = request.body.owner
    try {
      for (let index = 0; index < request.body.uas_registrations.length; index++) {
        const element = request.body.uas_registrations[index];
        let veh = await this.daoVehiculo.oneByUser(element, username)
        request.body.uas_registrations[index] = veh
      }

    } catch (error) {
      errors.push(`The selected vehicle doesn't exists or you no are the owner.`)
    }
    // request.body.creator = username
    request.body.creator = usernameFromRequest
    request.body.state = OperationState.PROPOSED

    if (errors.length == 0) {
      try {
        let operation = <Operation>await this.dao.save(request.body)
        sendNewOperation({gufi: operation.gufi})
        return response.json(operation);
      } catch (error) {
        response.status(400)
        return response.json(error)
      }
    } else {
      response.status(400)
      return response.json(errors)
    }
  }

  async acpetPendingOperation(request: Request, response: Response, next: NextFunction) {
    let gufi = request.params.id
    let comments = request.body.comments
    let approved = request.body.approved

    console.log(`Gufi::${gufi}, ->${JSON.stringify(request.body)}`)
    try {
      let { role, username } = getPayloadFromResponse(response)

      if (role == Role.ADMIN) {
        let newState = approved? OperationState.ACCEPTED : OperationState.CLOSED
        // let result = await this.dao.updateStateWhereState(gufi, OperationState.PENDING, OperationState.ACCEPTED);
        let result = await this.dao.updateStateWhereState(gufi, OperationState.PENDING, newState);
        changeState({
          gufi: gufi,
          state: newState
        })
        // console.log(`** Result of update:: ${JSON.stringify(result)}:: (result.affected)=${result.affected} && (result.affected == 1)=${result.affected == 1}`)
        if ((result.affected) && (result.affected == 1)) {
          let approval = await this.addNewAproval(username, gufi, comments, approved)
          return response.json(approval);
        }
        else {
          return response.sendStatus(404)
        }

      } else {
        return response.sendStatus(401)
      }
    } catch (error) {
      return response.sendStatus(404)
    }
  }

  async updateState(request: Request, response: Response, next: NextFunction) {
    let gufi = request.params.id
    let newState = request.body.state

    console.log(`Gufi::${gufi}, ->${JSON.stringify(request.body)}`)
    try {
      let { role, username } = getPayloadFromResponse(response)

      if (role == Role.ADMIN) {
        // let result = await this.dao.updateStateWhereState(gufi, OperationState.PENDING, OperationState.ACCEPTED);
        let result = await this.dao.updateState(gufi, newState);
        changeState({
          gufi: gufi,
          state: newState
        })
        return response.json(result);
      } else {
        return response.sendStatus(401)
      }
    } catch (error) {
      return response.sendStatus(404)
    }
  }

  private async addNewAproval(username, operationGufi, comments, approved) {
    let appr = {
      user: {username},
      operation: {gufi:operationGufi},
      approved: approved,
      comments: comments,
    }
    let approvalDao = new ApprovalDao()
    let result = await approvalDao.save(appr)
    return Object.assign(appr, result.raw[0])
  }



  async getOperationByPoint(request: Request, response: Response, next: NextFunction) {
    return response.json(await this.dao.getOperationByPoint(request.body))
  }

  async getOperationByVolumeOperation(request: Request, response: Response, next: NextFunction) {
    return response.json(await this.dao.getOperationByVolume(request.body))
  }


  /**
   * Return an operation associated with passed gufi and that login user is owner.
   * @param request 
   * @param response 
   * @param next 
   */
  async operationsByCreator(request: Request, response: Response, next: NextFunction) {
    let { username, role } = response.locals.jwtPayload
    let ops;
    // let state = request.query.state

    ops = await this.dao.operationsByCreator(username, request.query)
    return response.json({ count: ops.length, ops });
  }

  /**
   * Returns Operations owned by current user
   * @param request
   * @param response
   * @param next
   */
  async operationsByOwner(request: Request, response: Response, next: NextFunction) {
    let { username, role } = response.locals.jwtPayload
    let ops;
    ops = await this.dao.operationsByOwner(username, request.query)
    return response.json({ count: ops.length, ops });
  }


  /**
   * Remove an operation by gufi. If user is PILOT and is not the owner return 404
   * DELETE /operation/b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63
   * @param request 
   * @param response 
   * @param next 
   */
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
      // console.log(`Will remove the operation ${opToRemove.gufi}`)
      let removedOperation = await this.dao.removeOperation(opToRemove)
      // console.log(`Removed the operation ${removedOperation.gufi}`)
      return response.json(removedOperation)
    } catch (error) {
      return response.sendStatus(404)
    }

  }
}


function validateOperation(operation: any) {
  let errors = []
  // let op: Operation = operation
  let op = operation
  if(!op.owner){
    errors.push(`Owner is a mandatory field`)
  }
  if (op.operation_volumes.length != 1) {
    errors.push(`Operation must have only 1 volume and has ${op.operation_volumes.length}`)
  } else {
    for (let index = 0; index < op.operation_volumes.length; index++) {
      const element = op.operation_volumes[index];
      
      var firstItem = element.operation_geography.coordinates[0];
      var lastItem = element.operation_geography.coordinates[element.operation_geography.coordinates.length-1];
      if(firstItem != lastItem){
        errors.push(`Invalid polygon`)
      }
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
      if (!effectiveTimeBeginValid) {
        errors.push(`effective_time_begin ${element.effective_time_begin} must have the format ${dateTimeStringFormat}`)
      }
      const effectiveTimeEndValid = validateStringDateIso(element.effective_time_end)
      if (!effectiveTimeEndValid) {
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
        } 
    //     else
    //       if (difference > MAX_TIME_INTERVAL) {
    //         errors.push(`The time interval must be lower than ${MAX_TIME_INTERVAL / 60 / 1000 / 60} hours and is ${roundWithDecimals(difference / 60 / 1000 / 60)} hours`)
    //       }
    }
  }
  return errors
}

function roundWithDecimals(num) {
  return Math.round(num * 100) / 100
}

function changeState(operationInfo){
  sendOpertationStateChange(operationInfo)
}
