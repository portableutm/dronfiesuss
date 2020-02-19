import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Operation } from "./Operation";

@Entity()
export class Position {
    // @PrimaryGeneratedColumn("uuid")
    // message_id?: string;

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({type: 'numeric'})
    'altitude_gps': number; //Altitude;
    'altitude_num_gps_satellites': number;
    'comments' ? : string;
    'enroute_positions_id': string;

    @ManyToOne(type => Operation,{
        eager: false,
        // cascade: ["insert", "update"]
    })
    'gufi': Operation;
    'hdop_gps': number;

    @Column("geometry", {nullable: true})
    'location': GeoJSON.Point;
    'time_measured': string;

    @Column({type: "timestamp"})
    'time_sent': string;
    'track_bearing': number;
    'track_bearing_reference': "TRUE_NORTH" | "MAGNETIC_NORTH";
    'track_bearing_uom': "DEG";
    'track_ground_speed': number;
    'track_ground_speed_units': "KT" | "KM_H";
    'uss_name': string;
    'discovery_reference' ? : string;
    'vdop_gps': number;
}