import {getRepository} from "typeorm";
import { UTMMessage } from "../entities/UTMMessage";

export class  UTMMessageDao{

    private repository = getRepository(UTMMessage);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        return this.repository.findOne(id);
    }

    async save(msg:UTMMessage) {
        return this.repository.save(msg);
    }

    async remove(id : string) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }

}