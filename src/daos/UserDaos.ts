import {getRepository} from "typeorm";
import { User } from "../entities/User";

export class UserDao {

    private userRepository = getRepository(User);

    async all() {
        return this.userRepository.find();
    }

    async one(id : number) {
        return this.userRepository.findOne(id);
    }

    async save(vehicle:User) {
        return this.userRepository.save(vehicle);
    }

    async remove(id : number) {
        let userToRemove = await this.userRepository.findOne(id);
        await this.userRepository.remove(userToRemove);
    }

}