import {NextFunction, Request, Response} from "express";
import { OperationDao } from "../daos/OperationDaos";
import { Role } from "../entities/User";

export class OperationController {

    private dao = new OperationDao()

    /**
     * Return all operations, if state passed return all operations with this state
     * query params: state=OperationState 
     * @param request 
     * @param response 
     * @param next 
     */
    async all(request: Request, response: Response, next: NextFunction) {
      let state = request.query.state;
      let ops = await this.dao.all({state:state})
      return response.json({count:ops.length, ops});
    }

    async one(request: Request, response: Response, next: NextFunction) {
      // console.log(` ---> request.params.gufi:${request.params.id}`)
      return response.json(await this.dao.one(request.params.id));
    }

    async save(request: Request, response: Response, next: NextFunction) {
      let op_vols = request.body.operation_volumes
      let error = false
      if(op_vols !== undefined){
          for (let index = 0; index < op_vols.length; index++) {
            const element = op_vols[index];
            let intersect  = await this.checkIntersection(element)
            if(intersect){
              error = true
            }
          }
      }
      if(error){
        return response.json({"Error": `The operation registrated intersect with an other operation`})
      }else{
        return response.json(await this.dao.save(request.body));
      }
    }

    async getOperationByPoint(request: Request, response: Response, next: NextFunction) {
      return response.json(await this.dao.getOperationByPoint(request.body))
    }

    async getOperationByVolumeOperation(request: Request, response: Response, next: NextFunction) {
      return response.json(await this.dao.getOperationByVolume(request.body))
    }

    async operationsByCreator(request: Request, response: Response, next: NextFunction) {
      // let state = request.query.state;
      let {username,role} = response.locals.jwtPayload
      console.log(` ------------------ operationsByCreator ${username} ------------`)
      let ops;
      
      if(role == Role.PILOT){
        ops = await this.dao.operationsByCreator(username)
      }else{
        ops = await this.dao.all()
      }
      return response.json({count:ops.length, ops});
    }

    async checkIntersection(operationVolume){
      try{
        let operationsCount = await this.dao.getOperationVolumeByVolumeCount(operationVolume)
        return operationsCount>0;
      }catch(e){
        console.log(e)
        return true //TODO throw exception
      }
    }

}

