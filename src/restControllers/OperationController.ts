import { NextFunction, Request, Response } from "express";
import { OperationDao } from "../daos/OperationDaos";
import { Role } from "../entities/User";
import { getPayloadFromResponse } from "../utils/authUtils";
import { VehicleDao } from "../daos/VehicleDao";

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
    let { role } = getPayloadFromResponse(response)
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
  
    try {
      for (let index = 0; index < request.body.uas_registrations.length; index++) {
        const element = request.body.uas_registrations[index];
        let veh = await this.daoVehiculo.oneByUser(element, username)
        request.body.uas_registrations[index] = veh
      }

    } catch (error) {
      response.status(400)
      return response.json(`Error with vehicle.`)
    }
    request.body.creator = username

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
    if (error) {
      return response.json({ "Error": `The operation registrated intersect with an other operation` })
    } else {
      return response.json(await this.dao.save(request.body));
    }
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

}

