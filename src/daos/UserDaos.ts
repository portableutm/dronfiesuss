import { getRepository } from "typeorm";
import { Role, User } from "../entities/User";
import { DinaciaUser } from "../entities/DinaciaUser";

export class UserDao {

    private userRepository = getRepository(User);
    private dinaciaUserRepository = getRepository(DinaciaUser);

    async all() {
        return this.userRepository.find();
    }

    async one(username: string) {
        // console.log(`username: ${username}`)
        return this.userRepository.findOneOrFail(username);
    }

    async oneWithPassword(username: string) {
        // console.log(`username: ${username}`)
        return this.userRepository
            .createQueryBuilder()
            .select("user")
            .addSelect("user.password")
            .from(User, "user")
            .where("user.username = :username", { username: username })
            .getOne()
        return this.userRepository.findOneOrFail(username);
    }

    async save(user: User) {
        // console.log(`Save user: ${JSON.stringify(user, null, 2)}`)
        let dinaciaUser = user.dinacia_user
        let d;
        if(dinaciaUser){
            d = await this.dinaciaUserRepository.save(dinaciaUser)
        }
        user.dinacia_user = d
        let u = await this.userRepository.insert(user)
        //let u = await this.userRepository.save(user);
        return u;
    }

    async update(user: User) {
        let u = await this.userRepository.save(user);
        return u;
    }

    async remove(username: string) {
        let userToRemove = await this.userRepository.findOne(username);
        await this.userRepository.remove(userToRemove);
    }

}