import {Entity, PrimaryGeneratedColumn, Column, OneToMany, 
    ManyToOne, ManyToMany, JoinTable} from "typeorm";


type ContingencyCause = "LOST_C2_UPLINK" | "LOST_C2_DOWNLINK" | "LOST_NAV" | "LOST_SAA" | "LOW_FUEL" | "NO_FUEL" | "MECHANICAL_PROBLEM" | "SOFTWARE_PROBLEM" | "ENVIRONMENTAL" | "SECURITY" | "TRAFFIC" | "LOST_USS" | "OTHER" | "ANY"

@Entity()
export class ContingencyPlan {
    @PrimaryGeneratedColumn()
    'contingency_id': number;
    @Column("simple-array")
    'contingency_cause': ContingencyCause[];
    @Column()
    'contingency_response': "LANDING" | "LOITERING" | "RETURN_TO_BASE" | "OTHER";
    @Column("geometry")
    'contingency_polygon': GeoJSON.Polygon;
    @Column()
    'loiter_altitude'?: number; // 'loiter_altitude'?: Altitude;
    @Column()
    'relative_preference'?: number;
    @Column()
    'contingency_location_description': "PREPROGRAMMED" | "OPERATOR_UPDATED" | "UA_IDENTIFIED" | "OTHER";
    @Column("simple-array")
    'relevant_operation_volumes'?: number[]//Array<number>;
    @Column({type: "timestamp"})
    'valid_time_begin': string;
    @Column({type: "timestamp"})
    'valid_time_end': string;
    @Column({nullable:true})
    'free_text'?: string;
}