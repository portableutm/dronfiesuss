import {getRepository} from "typeorm";
// import { Position } from "../entities/Position";
import { Operation } from "../entities/Operation";
import { Approval } from "../entities/Approval";

export class  ApprovalDao{

    private repository = getRepository(Approval);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        return this.repository.findOne(id);
    }

    async save(entity) {
        return this.repository.insert(entity);
    }


}