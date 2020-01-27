import {Entity, PrimaryGeneratedColumn, Column, OneToMany, 
    ManyToOne, ManyToMany, JoinTable} from "typeorm";


// type ContingencyCause = 
// "LOST_C2_UPLINK" | "LOST_C2_DOWNLINK" | "LOST_NAV" | "LOST_SAA" | "LOW_FUEL" | "NO_FUEL" | "MECHANICAL_PROBLEM" | "SOFTWARE_PROBLEM" | "ENVIRONMENTAL" | "SECURITY" | "TRAFFIC" | "LOST_USS" | "OTHER" | "ANY"

export enum ContingencyCause {
    LOST_C2_UPLINK = "LOST_C2_UPLINK" 
    , LOST_C2_DOWNLINK = "LOST_C2_DOWNLINK" 
    , LOST_NAV = "LOST_NAV" 
    , LOST_SAA = "LOST_SAA" 
    , LOW_FUEL = "LOW_FUEL" 
    , NO_FUEL = "NO_FUEL" 
    , MECHANICAL_PROBLEM = "MECHANICAL_PROBLEM" 
    , SOFTWARE_PROBLEM = "SOFTWARE_PROBLEM" 
    , ENVIRONMENTAL = "ENVIRONMENTAL" 
    , SECURITY = "SECURITY" 
    , TRAFFIC = "TRAFFIC" 
    , LOST_USS = "LOST_USS" 
    , OTHER = "OTHER" 
    , ANY = "ANY"
}

export enum ContingencyResponse {
      LANDING = "LANDING" 
    , LOITERING = "LOITERING" 
    , RETURN_TO_BASE = "RETURN_TO_BASE" 
    , OTHER = "OTHER"
}

export enum  ContingencyLocationDescription{
    PREPROGRAMMED= "PREPROGRAMMED" 
    , OPERATOR_UPDATED= "OPERATOR_UPDATED" 
    , UA_IDENTIFIED= "UA_IDENTIFIED" 
    , OTHER = "OTHER"
}


@Entity()
export class ContingencyPlan {
    @PrimaryGeneratedColumn()
    'contingency_id': number;
    @Column("simple-array")
    'contingency_cause': ContingencyCause[];
    @Column()
    'contingency_response': ContingencyResponse; //"LANDING" | "LOITERING" | "RETURN_TO_BASE" | "OTHER";
    @Column("geometry")
    'contingency_polygon': GeoJSON.Polygon;
    @Column()
    'loiter_altitude'?: number; // 'loiter_altitude'?: Altitude;
    @Column()
    'relative_preference'?: number;
    @Column()
    'contingency_location_description': ContingencyLocationDescription //"PREPROGRAMMED" | "OPERATOR_UPDATED" | "UA_IDENTIFIED" | "OTHER";
    @Column("simple-array")
    'relevant_operation_volumes'?: number[]//Array<number>;
    @Column({type: "timestamp"})
    'valid_time_begin': string;
    @Column({type: "timestamp"})
    'valid_time_end': string;
    @Column({nullable:true})
    'free_text'?: string;
}