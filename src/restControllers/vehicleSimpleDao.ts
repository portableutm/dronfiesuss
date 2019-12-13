import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { VehicleReg } from "../entities/VehicleReg";

export class VehicleDao {

    private userRepository = getRepository(VehicleReg);

    async all() {
        return this.userRepository.find();
    }

    async one(id : number) {
        return this.userRepository.findOne(id);
    }

    async save(vehicle:VehicleReg) {
        return this.userRepository.save(vehicle);
    }

    async remove(id : number) {
        let userToRemove = await this.userRepository.findOne(id);
        await this.userRepository.remove(userToRemove);
    }

}