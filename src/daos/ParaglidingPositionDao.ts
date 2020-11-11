import {getRepository} from "typeorm";
import { ParaglidingPosition } from "../entities/ParaglidingPosition";
import { Operation } from "../entities/Operation";

export class  ParaglidingPositionDao{

    private repository = getRepository(ParaglidingPosition);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        return this.repository.findOne(id);
    }

    async save(entity /*:Position*/) {
        return this.repository.save(entity);
    }


}