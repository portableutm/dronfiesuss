import {getRepository} from "typeorm";
import { VehicleReg } from "../entities/VehicleReg";

export class VehicleDao {

    private repository = getRepository(VehicleReg);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        console.log(`Dao vehiculo::id>${id}<`)
        let v =  await this.repository.findOneOrFail(id);
        // let vehiculos = this.repository.find({
        //     where: [
        //       { uvin: id},
        //     ]
        //   });
        // let v = vehiculos[0]
        console.log(`Dao vehiculo::vehicle>${JSON.stringify(v)}<`)
        return v;
    }

    async oneByUser(id : string, username: string) {
        console.log(`Dao vehiculo::id>${id}<`)
        let v =  await this.repository.findOneOrFail(id,{
            where : {
                registeredBy : username
            }
        });
        // let vehiculos = this.repository.find({
        //     where: [
        //       { uvin: id},
        //     ]
        //   });
        // let v = vehiculos[0]
        console.log(`Dao vehiculo::vehicle>${JSON.stringify(v)}<`)
        return v;
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