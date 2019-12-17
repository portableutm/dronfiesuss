import {getRepository} from "typeorm";

import { Point } from "geojson";
import { Operation } from "../entities/Operation";
import { OperationVolume } from "../entities/OperationVolume";

export class OperationDao {

    private repository = getRepository(Operation);

// query que funciona
// SELECT gufi, flight_comments, ST_AsGeoJSON("operationVolumeOperation_geography")
// FROM operation o
// WHERE st_contains("operationVolumeOperation_geography" ,st_geomfromtext('POINT(-56.15444898605347 -34.90696211766489)'))

    async getOperationByPoint(point:Point){
        console.log("*************")
        console.log(point)
        return this.repository
        .createQueryBuilder()
        .where("st_contains(\"operationVolumeOperation_geography\" ,ST_GeomFromGeoJSON(:origin))")
        .setParameters({
            origin: JSON.stringify(point)
        })
        .getMany()
    }

    // select *
    // from operation
    // where 
    // tsrange("operationVolumeEffective_time_begin", "operationVolumeEffective_time_end") && tsrange('2019-12-11 13:59:10'::TIMESTAMP, '2019-12-11 19:59:10'::TIMESTAMP) 
    // AND ((int4range("operationVolumeMin_altitude", "operationVolumeMax_altitude") && int4range(30, 100)))

    async getOperationByVolume(volume : OperationVolume){
        return this.repository
        .createQueryBuilder()
        .where("(tsrange(\"operationVolumeEffective_time_begin\", \"operationVolumeEffective_time_end\") && tsrange(:date_begin, :date_end) ) "
        + " OR (int4range(\"operationVolumeMin_altitude\", \"operationVolumeMax_altitude\") && int4range(:min_altitude, :max_altitude)) " 
        + " OR (ST_Intersects(\"operationVolumeOperation_geography\" ,ST_GeomFromGeoJSON(:geom)))")
        .setParameters({
            date_begin : volume.effective_time_begin,
            date_end : volume.effective_time_end,
            min_altitude : volume.min_altitude,
            max_altitude : volume.max_altitude,
            geom: JSON.stringify(volume.operation_geography)
        })
        .getMany()
    }

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        return this.repository.findOne(id);
    }

    async save(vehicle:Operation) {
        return this.repository.save(vehicle);
    }

    async remove(id : number) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }

}   