import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Operation } from "./Operation";
import { User } from "./User";

@Entity()
export class ParaglidingPosition {

    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(type => User,{
        eager: false,
    })
    'user': User;

    @Column({type: 'numeric'})
    'altitude_gps': number; //Altitude;

    @Column("geometry", {nullable: true})
    'location': GeoJSON.Point;

    @Column({type: "timestamp"})
    'time_sent': string;

}