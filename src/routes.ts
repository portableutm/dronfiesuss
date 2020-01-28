import { UserController } from "./restControllers/UserController";
import { VehicleController } from "./restControllers/VehicleController";
import { OperationController } from "./restControllers/OperationController";
import { UTMMessageController } from "./restControllers/UtmMessageRestController";
import { AuthController } from "./restControllers/AuthController";
import { PositionController } from "./restControllers/PositionController";
import { UASVolumeReservationController } from "./restControllers/UASVolumeReservationController";

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
        action: "all",
        middlewares: [checkJwt]
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
        action: "save",
        middlewares: [checkJwt]
    }, {
        method: "delete",
        route: `/${route}/:id`,
        controller: Dao,
        action: "remove",
        middlewares: [checkJwt]
    }];
}

let operations = [
{
    method: "post",
    route: `/operation/geo`,
    controller: OperationController,
    action: "getOperationByPoint",
    middlewares: [checkJwt]  
},
{
    method: "post",
    route: `/operation/volume`,
    controller: OperationController,
    action: "getOperationByVolumeOperation",
    middlewares: [checkJwt]  
},
{
    method: "get",
    route: `/operation/creator`,
    controller: OperationController,
    action: "operationsByCreator",
    middlewares: [checkJwt]  
},
...doRoutes("operation", OperationController)

]

let auth = [{
    method: "post",
    route: `/auth/login`,
    controller: AuthController,
    action: "login"
    
}]

let r : CustomRoute[] = [
    ...doRoutes("user",UserController),
    ...doRoutes("utmmessage", UTMMessageController),
    ...doRoutes("vehicle", VehicleController), 
    ...doRoutes("position", PositionController), 
    ...doRoutes("uasvolume", UASVolumeReservationController), 
    ...operations, 
    ...auth
];
  
export const Routes = r;
