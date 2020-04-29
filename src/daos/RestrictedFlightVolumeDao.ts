import {getRepository} from "typeorm";
import { OperationVolume } from "../entities/OperationVolume";
import { RestrictedFlightVolume } from "../entities/RestrictedFlightVolume";

export class RestrictedFlightVolumeDao {

    private repository = getRepository(RestrictedFlightVolume);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        let v =  await this.repository.findOneOrFail(id);
        return v;

    }

    async save(entitie :RestrictedFlightVolume) {
        // console.log(`${JSON.stringify(entitie)}`)
        return this.repository.save(entitie);
    }

    async remove(id : string) {
        let entitie = await this.repository.findOne(id);
        await this.repository.remove(entitie);
    }


    // async countUvrIntersections(volume : OperationVolume){
    //     return this.repository
    //     .createQueryBuilder("uas_volume_reservation")
    //     .where("(tsrange(effective_time_begin, \"effective_time_end\") && tsrange(:date_begin, :date_end) ) "
    //     + " AND (numrange(\"min_altitude\", \"max_altitude\") && numrange(:min_altitude, :max_altitude)) " 
    //     + " AND (ST_Intersects(\"geography\" ,ST_GeomFromGeoJSON(:geom)))"
    //     )
    //     .setParameters({
    //         // gufi: gufi,
    //         date_begin : volume.effective_time_begin,
    //         date_end : volume.effective_time_end,
    //         min_altitude : volume.min_altitude,
    //         max_altitude : volume.max_altitude,
    //         geom: JSON.stringify(volume.operation_geography)
    //     })
    //     .getCount()
    // }


}