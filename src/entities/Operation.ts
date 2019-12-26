import {Entity, PrimaryGeneratedColumn, Column, AfterLoad, OneToMany, OneToOne, ManyToOne, ManyToMany} from "typeorm";
import { Point } from "geojson";

import { OperationVolume } from "./OperationVolume";
import { User } from "./User";
import { VehicleReg } from "./VehicleReg";

type operations_vol = Array<OperationVolume>;

export enum OperationState {
    PROPOSED
    ,ACCEPTED
    ,ACTIVATED
    ,CLOSED
    ,NONCONFORMING
    ,ROGUE
}
export enum OperatonFaaRule {
    PART_107
    ,PART_107X
    ,PART_101E
    ,OTHER
}

@Entity()
export class Operation {
    @PrimaryGeneratedColumn("uuid")
    'gufi': string;
    // 'uss_name': string;
    // 'discovery_reference'?: string;
    @Column({type: "timestamp"})
    'submit_time': string;
    @Column({type: "timestamp"})
    'update_time': string;
    @Column({nullable:true})
    'aircraft_comments'?: string;
    @Column({nullable:true})
    'flight_comments'?: string;
    @Column({nullable:true})
    'volumes_description'?: string;

    
    @Column({nullable:true})
    'airspace_authorization'?: string;
    @Column({nullable:true})
    'flight_number'?: string;
    
    @Column()
    'state': OperationState //"PROPOSED" | "ACCEPTED" | "ACTIVATED" | "CLOSED" | "NONCONFORMING" | "ROGUE";
       
    @Column("geometry", {nullable: true})
    'controller_location': Point;
    @Column("geometry", {nullable: true})
    'gcs_location'?: Point;

    @Column()
    'faa_rule': OperatonFaaRule // "PART_107" | "PART_107X" | "PART_101E" | "OTHER";
    
    // @Column(type => OperationVolume)
    @OneToMany(type => OperationVolume, operation_volume => operation_volume.operation, {
        eager: true,
        cascade: true
    })
    'operation_volumes': OperationVolume[];
    

    // 'uas_registrations': Array<UasRegistration>;

    @ManyToMany(type => VehicleReg, {
        eager: true
    })
    'uas_registrations': VehicleReg[];

    @ManyToOne(type => User,{
        eager: true
    })
    'contact': User;
    // 'contingency_plans': Array<ContingencyPlan>;
    // 'negotiation_agreements'?: Array<NegotiationAgreement>;
    // 'priority_elements'?: PriorityElements;

    
    // 'operation_volumes': operations_vol;
    // 'metadata': EventMetadata;

    // @AfterLoad()
    // updateCounters() {
    //     if (this.likesCount === undefined)
    //         this.likesCount = 0;
    // }
}


