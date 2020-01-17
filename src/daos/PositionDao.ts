import {getRepository} from "typeorm";
import { Position } from "../entities/Position";

export class  PositionDao{

    private repository = getRepository(Position);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        return this.repository.findOne(id);
    }

    async save(entity:Position) {
        return this.repository.save(entity);
    }

    // async remove(id : string) {
    //     let userToRemove = await this.repository.findOne(id);
    //     await this.repository.remove(userToRemove);
    // }

}