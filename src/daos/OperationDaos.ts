import { getRepository } from "typeorm";

import { Point, Polygon } from "geojson";
import { Operation, OperationState } from "../entities/Operation";
import { OperationVolume } from "../entities/OperationVolume";

export class OperationDao {
    private repository = getRepository(Operation);
    private repositoryOperationVolume = getRepository(OperationVolume);
    // query que funciona
    // SELECT gufi, flight_comments, ST_AsGeoJSON("operationVolumeOperation_geography")
    // FROM operation o
    // WHERE st_contains("operationVolumeOperation_geography" ,st_geomfromtext('POINT(-56.15444898605347 -34.90696211766489)'))

    async getOperationByPoint(point: Point) {
        
        return this.repository
            .createQueryBuilder("operation")
            .leftJoinAndSelect("operation.creator", "creator")
            .leftJoinAndSelect("operation.owner", "owner")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            
            .where("st_contains(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:origin))")
            .setParameters({
                origin: JSON.stringify(point)
            })
            .getMany()
            
    }


    async getOperationByVolume(volume: OperationVolume) {
        return this.repository
            .createQueryBuilder("operation")
            .leftJoinAndSelect("operation.creator", "creator")
            .leftJoinAndSelect("operation.owner", "owner")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .where("tsrange(operation_volume.\"effective_time_begin\", operation_volume.\"effective_time_end\") && tsrange(:date_begin, :date_end) ")
            .andWhere("(numrange(operation_volume.\"min_altitude\", operation_volume.\"max_altitude\") && numrange(:min_altitude, :max_altitude)) ")
            .andWhere("(ST_Intersects(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))")
            .setParameters({
                date_begin: new Date(volume.effective_time_begin),
                date_end: new Date(volume.effective_time_end),
                min_altitude: volume.min_altitude,
                max_altitude: volume.max_altitude,
                geom: JSON.stringify(volume.operation_geography)
            })
            .getMany()
    }

    async getOperationByPolygonAndAltitude(volume: OperationVolume) {
        return this.repository
            .createQueryBuilder("operation")
            .leftJoinAndSelect("operation.creator", "creator")
            .leftJoinAndSelect("operation.owner", "owner")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            
            .where("(numrange(operation_volume.\"min_altitude\", operation_volume.\"max_altitude\") && numrange(:min_altitude, :max_altitude)) "
                + " AND (ST_Intersects(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))")
            .setParameters({
                min_altitude: volume.min_altitude,
                max_altitude: volume.max_altitude,
                geom: JSON.stringify(volume.operation_geography)
            })
            .getMany()
    }



    async getOperationByPolygon(polygon: Polygon, filterParam?: any) {
        let whereFilter = ["(ST_Intersects(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))"]
        let filter: any = {}
        let state
        if ((filterParam !== undefined) && (filterParam.state !== undefined)) {
            // filter.where = { state: filterParam.state}
            // state = (`"state" = ${filterParam.state}`)
            whereFilter.push(`"state" = ${filterParam.state}`)
        }

        return this.repository
            .createQueryBuilder("operation")
            .leftJoinAndSelect("operation.creator", "creator")
            .leftJoinAndSelect("operation.owner", "owner")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            
            .where(
                whereFilter.join(" AND ")
            )
            .setParameters({
                // date_begin : volume.effective_time_begin,
                // date_end : volume.effective_time_end,
                // min_altitude : volume.min_altitude,
                // max_altitude : volume.max_altitude,
                geom: JSON.stringify(polygon)
            })
            .getMany()
    }

    async getOperationVolumeByVolumeCount(volume: OperationVolume) {
        return this.repositoryOperationVolume
            .createQueryBuilder("operation_volume")
            // .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .where("(tsrange(effective_time_begin, \"effective_time_end\") && tsrange(:date_begin, :date_end) ) "
                + " AND (numrange(\"min_altitude\", \"max_altitude\") && numrange(:min_altitude, :max_altitude)) "
                + " AND (ST_Intersects(\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))"
            )
            .setParameters({
                date_begin: volume.effective_time_begin,
                date_end: volume.effective_time_end,
                min_altitude: volume.min_altitude,
                max_altitude: volume.max_altitude,
                geom: JSON.stringify(volume.operation_geography)
            })
            .getCount()
    }

    // async getOperationVolumeByVolumeCountExcludingOneOperation(gufi: string, volume : OperationVolume){
    //     return this.repositoryOperationVolume
    //     .createQueryBuilder("operation_volume")
    //     .where("\"operationGufi\" != :gufi")
    //     .andWhere("(tsrange(effective_time_begin, \"effective_time_end\") && tsrange(:date_begin, :date_end) ) "
    //     + " AND (numrange(\"min_altitude\", \"max_altitude\") && numrange(:min_altitude, :max_altitude)) " 
    //     + " AND (ST_Intersects(\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))"
    //     )
    //     .setParameters({
    //         gufi: gufi,
    //         date_begin : volume.effective_time_begin,
    //         date_end : volume.effective_time_end,
    //         min_altitude : volume.min_altitude,
    //         max_altitude : volume.max_altitude,
    //         geom: JSON.stringify(volume.operation_geography)
    //     })
    //     .getCount()
    // }



    async countOperationVolumeByVolumeCountExcludingOneOperation(gufi: string, volume: OperationVolume) {
        return this.repository
            .createQueryBuilder("operation")
            .leftJoinAndSelect("operation.creator", "creator")
            .leftJoinAndSelect("operation.owner", "owner")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .where("operation_volume.\"operationGufi\" != :gufi")
            .andWhere("\"state\" in ('ACCEPTED', 'ACTIVATED', 'ROGUE', 'PENDING')")
            .andWhere("(tsrange(operation_volume.\"effective_time_begin\", operation_volume.\"effective_time_end\") && tsrange(:date_begin, :date_end))")
            .andWhere("(numrange(operation_volume.\"min_altitude\", operation_volume.\"max_altitude\") && numrange(:min_altitude, :max_altitude))")
            .andWhere("(ST_Intersects(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))")
            .setParameters({
                gufi: gufi,
                date_begin: volume.effective_time_begin,
                date_end: volume.effective_time_end,
                min_altitude: volume.min_altitude,
                max_altitude: volume.max_altitude,
                geom: JSON.stringify(volume.operation_geography)
            })
            .getCount()
    }

    async getOperationVolumeByVolumeCountExcludingOneOperation(gufi: string, volume: OperationVolume) {
        return this.repository
            .createQueryBuilder("operation")
            .leftJoinAndSelect("operation.creator", "creator")
            .leftJoinAndSelect("operation.owner", "owner")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .where("operation_volume.\"operationGufi\" != :gufi")
            .andWhere("\"state\" in ('ACCEPTED', 'ACTIVATED', 'ROGUE', 'PENDING')")
            .andWhere("(tsrange(operation_volume.\"effective_time_begin\", operation_volume.\"effective_time_end\") && tsrange(:date_begin, :date_end))")
            .andWhere("(numrange(operation_volume.\"min_altitude\", operation_volume.\"max_altitude\") && numrange(:min_altitude, :max_altitude))")
            .andWhere("(ST_Intersects(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:geom)))")
            .setParameters({
                gufi: gufi,
                date_begin: volume.effective_time_begin,
                date_end: volume.effective_time_end,
                min_altitude: volume.min_altitude,
                max_altitude: volume.max_altitude,
                geom: JSON.stringify(volume.operation_geography)
            })
            .getMany()
    }


    async all(filterParam?: any): Promise<Operation[]> {
        // console.log(`OperationDao.all -> ${JSON.stringify(filterParam)}`)
        let filter: any = {}
        if ((filterParam !== undefined) && (filterParam.state !== undefined)) {
            filter.where = { state: filterParam.state }
        }
        // console.log(`OperationDao.all -> ${JSON.stringify(filter)}`)
        return this.repository.find(filter);
    }

    async one(id: string) {
        if(!id){
            throw "Invalid gufi"
        }
        return this.repository.findOneOrFail(id);
    }

    async oneByCreator(id: string, username: string) {
        return this.repository.findOneOrFail(id, {
            where: {
                creator: username
            }
        });
    }

    async oneByOwner(id: string, username: string) {
        return this.repository.findOneOrFail(id, {
            where: {
                owner: username
            }
        });
    }

    async save(op: Operation) {
        return await this.repository.save(op);
    }

    async updateState(gufi, state: OperationState) {
        return await this.repository.update(gufi, { state: state });
    }


    async updateStateWhereState(gufi, oldState: OperationState, state: OperationState) {
        return await this.repository.update({ gufi: gufi, state: oldState }, { state: state });
    }



    async remove(id: number) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }
    async removeOperation(entity: Operation) {
        return await this.repository.remove(entity);
    }

    async operationsByCreator(username: string, params?: any) {
        // let filter : any = {}
        // if((filterParam!==undefined) && (filterParam.state !== undefined)){
        //     filter.where = { state: filterParam.state}
        // }
        // console.log(` ****** ***** Operations ${username}  ****** ***** `)

        let query = this.repository.
            createQueryBuilder("operation")
            .leftJoinAndSelect("operation.creator", "creator")
            .leftJoinAndSelect("operation.owner", "owner")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .leftJoinAndSelect('operation.uas_registrations', 'uas_registration')
            .leftJoinAndSelect('uas_registration.owner', 'vehicleowner')
            .leftJoinAndSelect('uas_registration.operators', 'vehicleoperators')
            .where(" creator.\"username\" =  :username")
            .orderBy('operation.submit_time', "DESC")
            .setParameters({
                username: username,
            })
        if (params && params.limit) {
            query.take(params.limit)
        }
        if (params && params.offset) {
            query.skip(params.offset)
        }

        return query.getMany()
    }

    async operationsByOwner(username: string, params?: any) {

        let query = this.repository.
            createQueryBuilder("operation")
            .leftJoinAndSelect("operation.creator", "creator")
            .leftJoinAndSelect("operation.owner", "owner")
            .leftJoinAndSelect("owner.dinacia_user", "dinacia_user")
            .leftJoinAndSelect("dinacia_user.dinacia_company", "dinacia_company")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .leftJoinAndSelect('operation.uas_registrations', 'uas_registration')
            .leftJoinAndSelect('uas_registration.owner', 'vehicleowner')
            .leftJoinAndSelect('uas_registration.operators', 'vehicleoperators')
            
            .where(" owner.\"username\" =  :username")
            .orderBy('operation.submit_time', "DESC")
            .setParameters({
                username: username,
            })
        if (params && params.limit) {
            query.take(params.limit)
        }
        if (params && params.offset) {
            query.skip(params.offset)
        }

        return query.getMany()
    }

    //     select * from operation
    // where state in ('ACCEPTED', 'PROPOSED')
    async getOperationsForCron() {
        return this.repository.
            createQueryBuilder("operation")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .leftJoinAndSelect("operation.owner", "owner")
            .leftJoinAndSelect("owner.dinacia_user", "dinacia_user")
            // .leftJoinAndSelect("dinacia_user.dinacia_company", "dinacia_company")
            .leftJoinAndSelect('operation.uas_registrations', 'uas_registration')
            .leftJoinAndSelect('uas_registration.dinacia_vehicle', 'dinacia_vehicle')
            .where("\"state\" in ('ACCEPTED', 'PROPOSED', 'ACTIVATED', 'ROGUE', 'PENDING')")
            .getMany()
    }

    /**
     * Return all operations that contain 'point', altitude, time and uvin
     * @param point 
     * @param altitude 
     * @param time 
     * @param uvin 
     */
    async getOperationByPositionAndDrone(point, altitude, time, uvin) {
        return this.repository
            .createQueryBuilder("operation")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .innerJoinAndSelect("operation.uas_registrations", "vehicle_reg")

            .where("st_contains(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:origin))")
            .andWhere(":altitude ::numeric <@ numrange(operation_volume.\"min_altitude\", operation_volume.\"max_altitude\")")
            .andWhere(":time ::timestamp <@ tsrange(operation_volume.\"effective_time_begin\", operation_volume.\"effective_time_end\")")
            .andWhere("\"state\" = 'ACTIVATED'")
            .andWhere("vehicle_reg.\"uvin\" = :uvin")
            .andWhere("vehicle_reg.\"authorized\" = 'AUTHORIZED'")
            .setParameters({
                origin: JSON.stringify(point),
                altitude: altitude,
                time: new Date(time),
                uvin: uvin

            })
            .getMany()
    }

    /**
     * Return all operations that contain 'point', altitude, time and uvin
     * @param point 
     * @param altitude 
     * @param time 
     * @param uvin 
     */
    async getOperationByPositionAndDroneTrackerId(point, altitude, time, trackerId) {
        console.log(`time:${time}, typeof:${typeof time}, date:${new Date(time)}, dateT:${typeof new Date(time)}, `)
       
        let query = this.repository
            .createQueryBuilder("operation")
            .innerJoinAndSelect("operation.operation_volumes", "operation_volume")
            .innerJoinAndSelect("operation.uas_registrations", "vehicle_reg")

            .where("st_contains(operation_volume.\"operation_geography\" ,ST_GeomFromGeoJSON(:point))")
            .andWhere(":altitude ::numeric <@ numrange(operation_volume.\"min_altitude\", operation_volume.\"max_altitude\")")
            .andWhere(":time ::timestamp <@ tsrange(operation_volume.\"effective_time_begin\", operation_volume.\"effective_time_end\")")
            .andWhere("\"state\" = 'ACTIVATED'")
            .andWhere("vehicle_reg.\"trackerId\" = :trackerId")
            .andWhere("vehicle_reg.\"authorized\" = 'AUTHORIZED'")
            .setParameters({
                point: JSON.stringify(point),
                altitude: altitude,
                time: new Date(time),
                trackerId: trackerId
                
            })
        
            console.log(`SQL:${query.getSql()}`)
        return query    .getMany()
    }

}   