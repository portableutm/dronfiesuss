import {UserController} from "./restControllers/UserController";
import {VehicleDao} from "./restControllers/vehicleDao";
import { OperationController } from "./restControllers/OperationController";

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
        action: "one"
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
}]

let r = [...doRoutes("user",UserController), ...doRoutes("vehicle", VehicleDao), ...operations];

export const Routes = r;