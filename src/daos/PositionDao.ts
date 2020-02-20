import {getRepository} from "typeorm";
import { Position } from "../entities/Position";
import { Operation } from "../entities/Operation";

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

    async checkPositionWithOperation(position : Position){
        console.log("")
        const result = 
        await getRepository(Operation)
        .createQueryBuilder("operation")
        .select("st_contains(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:origin))", "inOperation")
        .innerJoin("operation.operation_volumes", "operation_volume")
        .where("operation.\"gufi\" = :gufi")
        .setParameters({
            gufi: position.gufi,
            origin: JSON.stringify(position.location)
        })
        .getRawOne();

        console.log(result)
        return result
    }

    // async remove(id : string) {
    //     let userToRemove = await this.repository.findOne(id);
    //     await this.repository.remove(userToRemove);
    // }

}