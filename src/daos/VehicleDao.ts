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

    async save(vehicle:VehicleReg) {
        return this.repository.save(vehicle);
    }

    async remove(id : number) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }

}