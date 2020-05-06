import { Polygon } from "geojson";
import {
  Column, Entity, PrimaryGeneratedColumn, ManyToOne
} from "typeorm";
import { Operation } from "./Operation";


@Entity()
export class RestrictedFlightVolume {
    @PrimaryGeneratedColumn("uuid") 
    'id'?: String;

    @Column("geometry", {nullable: true})
    'geography': GeoJSON.Polygon

    // @Column({type: "timestamp without time zone", nullable:true})
    // 'effective_time_begin' ? : string
    // @Column({type: "timestamp without time zone", nullable:true})
    // 'effective_time_end' ? : string
    // @Column({type: "timestamp without time zone", nullable:true})
    // 'actual_time_end' ? : string

    @Column({type: 'numeric', nullable:true})
    'min_altitude': number //Altitude
    @Column({type: 'numeric', nullable:true})
    'max_altitude': number //Altitude

    @Column()
    'comments': String;

}
