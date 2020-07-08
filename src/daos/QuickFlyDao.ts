import {getRepository} from "typeorm";

import { QuickFly } from "../entities/QuickFly";

export class  QuickFlyDao{

    private repository = getRepository(QuickFly);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        return this.repository.findOne(id);
    }

    async save(entity) {
        return this.repository.insert(entity);
    }

    async allByUser(username:string) {
        return this.repository.find({
            where : {
                user : username
            }
        });
    }


}