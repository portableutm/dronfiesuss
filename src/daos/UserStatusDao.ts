import {getRepository} from "typeorm";
import { UserStatus } from "../entities/UserStatus";

export class UserStatusDao {

    private userRepository = getRepository(UserStatus);

    // async all() {
    //     return this.userRepository.find();
    // }

    // async one(username : string) {
    //     // console.log(`username: ${username}`)
    //     return this.userRepository.findOneOrFail(username);
    // }

    async save(status:UserStatus) {
        // console.log(`Save user: ${JSON.stringify(user)}`)
        let s = await this.userRepository.save(status)
        // let u = await this.userRepository.save(user);
        return s;
    }

    // async remove(username : string) {
    //     let userToRemove = await this.userRepository.findOne(username);
    //     await this.userRepository.remove(userToRemove);
    // }

}