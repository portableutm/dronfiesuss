import {getRepository} from "typeorm";
import { Notams } from "../entities/Notams";
import { OperationVolume } from "../entities/OperationVolume";
import { Polygon } from "geojson";

export class  NotamDao {

    private repository = getRepository(Notams);

    async all() {
        return this.repository.find();
    }

    async one(id : string) {
        return this.repository.findOneOrFail(id);
    }

    async save(notam:Notams) {
        return this.repository.insert(notam);
    }

    async remove(id : string) {
        let userToRemove = await this.repository.findOne(id);
        await this.repository.remove(userToRemove);
    }

    // async getNotamByVolume(volume : OperationVolume){
    //     return this.repository
    //     .createQueryBuilder("notams")
    //     .where("(tsrange(notams.\"effective_time_begin\", notams.\"effective_time_end\") && tsrange(:date_begin, :date_end) ) "
    //     + " AND (ST_Intersects(notams.\"geography\" ,ST_GeomFromGeoJSON(:geom)))")
    //     .setParameters({
    //         date_begin : volume.effective_time_begin,
    //         date_end : volume.effective_time_end,
    //         geom: JSON.stringify(volume.operation_geography)
    //     })
    //     .getMany()
    // }

    async getNotamByDateAndArea(date : string, polygon: Polygon){
        let params : any = {}
        let conditions = []
        if(date){
            let dateCondition = "( :date ::timestamp <@ tsrange(notams.\"effective_time_begin\", notams.\"effective_time_end\") )"
            // let dateCondition = "( tsrange(notams.\"effective_time_begin\", notams.\"effective_time_end\") <@  :date  )"
            conditions.push(dateCondition)
            params.date = new Date(date)
        }
        if(polygon){
            let polygonCOndition = "(ST_Intersects(notams.\"geography\" ,ST_GeomFromGeoJSON(:geom)))"
            conditions.push(polygonCOndition)
            params.geom = JSON.stringify(polygon)

        }

        return this.repository
        .createQueryBuilder("notams")
        .where(conditions.join(" AND "))
        .setParameters(params)
        .getMany()

        
        
    }

}