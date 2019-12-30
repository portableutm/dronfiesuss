import {getRepository} from "typeorm";
import { VehicleReg } from "../entities/VehicleReg";

export class VehicleDao {

    private repository = getRepository(VehicleReg);

    async all() {
        return this.repository.find();
    }

    async one(id : number) {
        return this.repository.findOne(id);
    }

//     {
//         "nNumber": "",
//         "faaNumber": "faaNumber_828",
//         "vehicleName": "vehicle_name828",
//         "manufacturer": "PIXHAWK",
//         "model": "model_828",
//         "class": "Fixed wing",
//         "accessType": "",
//         "vehicleTypeId": "",
//         "org-uuid": "",
//         "registeredBy": {
//             "username": "User_1"
//         }
//         "registeredBy": "User_1"
// }
    async save(vehicle:VehicleReg) {
        console.log(`${JSON.stringify(vehicle)}`)
        return this.repository.save(vehicle);
    }

    async remove(id : number) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }

}