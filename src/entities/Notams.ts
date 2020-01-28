import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

@Entity()
export class Notams {
    @PrimaryGeneratedColumn("uuid")
    message_id?: string;

    @Column()
    text: string;

    @Column("geometry", {nullable: true})
    'geography' ? : GeoJSON.Polygon

    @Column({type: "timestamp without time zone"})
    'effective_time_begin' ? : string
    @Column({type: "timestamp without time zone"})
    'effective_time_end' ? : string

}