import {getRepository} from "typeorm";
import { UASVolumeReservation } from "../entities/UASVolumeReservation";

export class UASVolumeReservationDao {

    private repository = getRepository(UASVolumeReservation);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        let v =  await this.repository.findOneOrFail(id);
        return v;

    }

    async save(entitie :UASVolumeReservation) {
        // console.log(`${JSON.stringify(entitie)}`)
        return this.repository.save(entitie);
    }

    async remove(id : string) {
        let entitie = await this.repository.findOne(id);
        await this.repository.remove(entitie);
    }

}