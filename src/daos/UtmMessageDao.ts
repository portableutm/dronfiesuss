import {getRepository} from "typeorm";
import { UTMMessage } from "../entities/UTMMessage";

export class  UTMMessageDao{

    private repository = getRepository(UTMMessage);

    async all() {
        return this.repository.find();
    }

    async one(id : number) {
        return this.repository.findOne(id);
    }

    async save(vehicle:UTMMessage) {
        return this.repository.save(vehicle);
    }

    async remove(id : number) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }

}