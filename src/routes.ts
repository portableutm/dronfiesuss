import {UserController} from "./restControllers/UserController";
import {VehicleDao} from "./restControllers/vehicleDao";
import { OperationController } from "./restControllers/OperationController";
import { UTMMessageController } from "./restControllers/UtmMessageRestController";
import { AuthController } from "./restControllers/AuthController";

import { checkJwt } from "./middleware/checkJwt";

interface CustomRoute{
    method: string
    route: string
    controller: any
    action: string
    middlewares?: any

}

const doRoutes = (route: String, Dao: any) => {
    return [{
        method: "get",
        route: `/${route}`,
        controller: Dao,
        action: "all"
    }, {
        method: "get",
        route: `/${route}/:id`,
        controller: Dao,
        action: "one",
        middlewares: [checkJwt]
    }, {
        method: "post",
        route: `/${route}`,
        controller: Dao,
        action: "save"
    }, {
        method: "delete",
        route: `/${route}/:id`,
        controller: Dao,
        action: "remove"
    }];
}

let operations = [...doRoutes("operation", OperationController),
{
    method: "post",
    route: `/operation/geo`,
    controller: OperationController,
    action: "getOperationByPoint"  
},
{
    method: "post",
    route: `/operation/volume`,
    controller: OperationController,
    action: "getOperationByVolumeOperation"  
}]

let auth = [{
    method: "post",
    route: `/auth/login`,
    controller: AuthController,
    action: "login"
    
}]

let r : CustomRoute[] = [...doRoutes("user",UserController),
 ...doRoutes("utmmessage", UTMMessageController),
  ...doRoutes("vehicle", VehicleDao), 
  ...operations, 
  ...auth];

export const Routes = r;
