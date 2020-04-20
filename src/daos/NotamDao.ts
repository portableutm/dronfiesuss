import {getRepository} from "typeorm";
import { Notams } from "../entities/Notams";

export class  NotamDao {

    private repository = getRepository(Notams);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        return this.repository.findOneOrFail(id);
    }

    async save(notam:Notams) {
        return this.repository.insert(notam);
    }

    async remove(id : string) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }

}