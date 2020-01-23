import {getRepository} from "typeorm";
import { User } from "../entities/User";

export class UserDao {

    private userRepository = getRepository(User);

    async all() {
        return this.userRepository.find();
    }

    async one(username : string) {
        console.log(`username: ${username}`)
        return this.userRepository.findOneOrFail(username);
    }

    async save(user:User) {

        return this.userRepository.save(user);
    }

    async remove(username : string) {
        let userToRemove = await this.userRepository.findOne(username);
        await this.userRepository.remove(userToRemove);
    }

}