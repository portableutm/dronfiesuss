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


    async countRfvIntersections(volume : OperationVolume){
        let count = await this.repository
        .createQueryBuilder("restricted_flight_volume")
        .where(
        "(numrange(\"min_altitude\", \"max_altitude\") && numrange(:min_altitude, :max_altitude)) " 
        + " AND (ST_Intersects(\"geography\" ,ST_GeomFromGeoJSON(:geom)))"
        )
        .setParameters({
            min_altitude : volume.min_altitude,
            max_altitude : volume.max_altitude,
            geom: JSON.stringify(volume.operation_geography)
        })
        .getCount()
        return count
    }


    async getRfvIntersections(volume : OperationVolume){
        let count = await this.repository
        .createQueryBuilder("restricted_flight_volume")
        .where(
        "(numrange(\"min_altitude\", \"max_altitude\") && numrange(:min_altitude, :max_altitude)) " 
        + " AND (ST_Intersects(\"geography\" ,ST_GeomFromGeoJSON(:geom)))"
        )
        .setParameters({
            min_altitude : volume.min_altitude,
            max_altitude : volume.max_altitude,
            geom: JSON.stringify(volume.operation_geography)
        })
        .getMany()
        return count
    }


}