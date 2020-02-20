import {getRepository} from "typeorm";

import { Point } from "geojson";
import { Operation, OperationState } from "../entities/Operation";
import { OperationVolume } from "../entities/OperationVolume";

export class OperationDao {
    private repository = getRepository(Operation);
    private repositoryOperationVolume = getRepository(OperationVolume);
    // query que funciona
    // SELECT gufi, flight_comments, ST_AsGeoJSON("operationVolumeOperation_geography")
    // FROM operation o
    // WHERE st_contains("operationVolumeOperation_geography" ,st_geomfromtext('POINT(-56.15444898605347 -34.90696211766489)'))

    async getOperationByPoint(point:Point){
        return this.repository
        .createQueryBuilder("operation")
        .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
        .where("st_contains(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:origin))")
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
        .createQueryBuilder("operation")
        .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
        .where("(tsrange(operation_volume.\"effective_time_begin\", operation_volume.\"effective_time_end\") && tsrange(:date_begin, :date_end) ) "
        + " AND (numrange(operation_volume.\"min_altitude\", operation_volume.\"max_altitude\") && numrange(:min_altitude, :max_altitude)) " 
        + " AND (ST_Intersects(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))")
        .setParameters({
            date_begin : volume.effective_time_begin,
            date_end : volume.effective_time_end,
            min_altitude : volume.min_altitude,
            max_altitude : volume.max_altitude,
            geom: JSON.stringify(volume.operation_geography)
        })
        .getMany()
    }

    async getOperationVolumeByVolumeCount(volume : OperationVolume){
        return this.repositoryOperationVolume
        .createQueryBuilder("operation_volume")
        // .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
        .where("(tsrange(effective_time_begin, \"effective_time_end\") && tsrange(:date_begin, :date_end) ) "
        + " AND (numrange(\"min_altitude\", \"max_altitude\") && numrange(:min_altitude, :max_altitude)) " 
        + " AND (ST_Intersects(\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))"
        )
        .setParameters({
            date_begin : volume.effective_time_begin,
            date_end : volume.effective_time_end,
            min_altitude : volume.min_altitude,
            max_altitude : volume.max_altitude,
            geom: JSON.stringify(volume.operation_geography)
        })
        .getCount()
    }

    async getOperationVolumeByVolumeCountExcludingOneOperation(gufi: string, volume : OperationVolume){
        return this.repositoryOperationVolume
        .createQueryBuilder("operation_volume")
        .where("\"operationGufi\" != :gufi")
        .andWhere("(tsrange(effective_time_begin, \"effective_time_end\") && tsrange(:date_begin, :date_end) ) "
        + " AND (numrange(\"min_altitude\", \"max_altitude\") && numrange(:min_altitude, :max_altitude)) " 
        + " AND (ST_Intersects(\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))"
        )
        .setParameters({
            gufi: gufi,
            date_begin : volume.effective_time_begin,
            date_end : volume.effective_time_end,
            min_altitude : volume.min_altitude,
            max_altitude : volume.max_altitude,
            geom: JSON.stringify(volume.operation_geography)
        })
        .getCount()
    }

    async all(filterParam?  :any) {
        // console.log(`OperationDao.all -> ${JSON.stringify(filterParam)}`)
        let filter : any = {}
        if((filterParam!==undefined) && (filterParam.state !== undefined)){
            filter.where = { state: filterParam.state}
        }
        // console.log(`OperationDao.all -> ${JSON.stringify(filter)}`)
        return this.repository.find(filter);
    }

    async one(id : string) {
        return this.repository.findOne(id);
    }

    async oneByCreator(id : string, username:string) {
        return this.repository.findOneOrFail(id, {
            where : {
                creator : username
            }
        });
    }

    async save(op:Operation) {
        try {
            return await this.repository.save(op);

        } catch (error) {
            return {}
        }
        
    }

    async updateState(gufi, state : OperationState) {
        return await this.repository.update(gufi, { state: state });
    }

    

    async remove(id : number) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }

    async operationsByCreator(username: string, filterParam?  :any) {
        let filter : any = {}
        if((filterParam!==undefined) && (filterParam.state !== undefined)){
            filter.where = { state: filterParam.state}
        }
        // console.log(` ****** ***** Operations ${username}  ****** ***** `)

        return this.repository.
        createQueryBuilder("operation")
        .innerJoinAndSelect("operation.creator", "creator")
        .where(" creator.\"username\" =  :username"
        )
        .setParameters({
            username : username,
        })
        .getMany()
    }

    //     select * from operation
    // where state in ('ACCEPTED', 'PROPOSED')
    async getOperationsForCron(){
        return this.repository.
        createQueryBuilder("operation")
        .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
        .where("\"state\" in ('ACCEPTED', 'PROPOSED', 'ACTIVATED', 'NONCONFORMING', 'ROGUE', 'NOT_ACCEPTED')")
        .getMany()
    }

}   