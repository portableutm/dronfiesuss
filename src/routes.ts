import { UserController } from "./restControllers/UserController";
import { VehicleController } from "./restControllers/VehicleController";
import { OperationController } from "./restControllers/OperationController";
import { UTMMessageController } from "./restControllers/UtmMessageRestController";
import { AuthController } from "./restControllers/AuthController";
import { PositionController } from "./restControllers/PositionController";
import { UASVolumeReservationController } from "./restControllers/UASVolumeReservationController";
// import { TestController } from "./restControllers/testController";

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

// if(process.env.NODE_ENV == "dev"){
//     let testRoute : CustomRoute = {
//         action : "changeDate",
//         controller : TestController,
//         method : "post",
//         middlewares : [checkJwt] ,
//         route : "/changeDate"
//     }
//     let testRoute2 : CustomRoute = {
//         action : "echo",
//         controller : TestController,
//         method : "post",
//         middlewares : [checkJwt] ,
//         route : "/echo"
//     }
//     // testRoute.action = "changeDate"
//     // testRoute.controller = TestController
//     // testRoute.method= "POST"
//     // testRoute.middlewares = [checkJwt] 
//     // testRoute.route = "changeDate"
//     r.push(testRoute)
//     r.push(testRoute2)
// }
  
export const Routes = r;
