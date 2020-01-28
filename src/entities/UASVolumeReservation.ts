import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn } from "typeorm";
import { Operation } from "./Operation";


export enum UASVolumeReservationType{
    DYNAMIC_RESTRICTION = "DYNAMIC_RESTRICTION",
    STATIC_ADVISORY = "STATIC_ADVISORY"
}

export enum UASVolumeReservationPermitedUas {
    NOT_SET = "NOT_SET"  ,
    PUBLIC_SAFETY = "PUBLIC_SAFETY"  ,
    SECURITY = "SECURITY" ,
    NEWS_GATHERING = "NEWS_GATHERING" ,
    VLOS = "VLOS"  ,
    SUPPORT_LEVEL = "SUPPORT_LEVEL" ,
    PART_107 = "PART_107" ,
    PART_101E = "PART_101E" ,
    PART_107X = "PART_107X" ,
    RADIO_LINE_OF_SIGHT = "RADIO_LINE_OF_SIGHT" ,
}

export enum UASVolumeReservationRequiredSupport {
    V2V = "V2V" 
    , DAA = "DAA" 
    , ADSB_OUT = "ADSB_OUT" 
    , ADSB_IN = "ADSB_IN" 
    , CONSPICUITY = "CONSPICUITY" 
    , ENHANCED_NAVIGATION = "ENHANCED_NAVIGATION" 
    , ENHANCED_SAFE_LANDING = "ENHANCED_SAFE_LANDING" 
}

export enum UASVolumeReservationCause {
    WEATHER = "WEATHER" 
    , ATC = "ATC" 
    , SECURITY = "SECURITY" 
    , SAFETY = "SAFETY" 
    , MUNICIPALITY = "MUNICIPALITY" 
    , OTHER = "OTHER"
}

@Entity()
export class UASVolumeReservation {
    @PrimaryGeneratedColumn("uuid")
    'message_id' ? : string;
    @Column()
    'uss_name' ? : string;
    @Column()
    'type' ? : UASVolumeReservationType //"STATIC_ADVISORY" ,"DYNAMIC_RESTRICTION";
    @Column("simple-array")
    'permitted_uas' ? : UASVolumeReservationPermitedUas []
    @Column("simple-array")
    'required_support' ? : UASVolumeReservationRequiredSupport []

    @ManyToMany(type => Operation)
    @JoinTable()
    'permitted_operations' ? : Operation[]; 

    'permitted_gufis' ? :Array <string>

    @Column()
    'cause' ? : UASVolumeReservationCause

    @Column("geometry", {nullable: true})
    'geography' ? : GeoJSON.Polygon

    @Column({type: "timestamp without time zone"})
    'effective_time_begin' ? : string
    @Column({type: "timestamp without time zone"})
    'effective_time_end' ? : string
    @Column({type: "timestamp without time zone"})
    'actual_time_end' ? : string

    @Column({type: 'numeric'})
    'min_altitude' ? : number //Altitude
    @Column({type: 'numeric'})
    'max_altitude' ? : number //Altitude
    @Column()
    'reason' ? : string
}