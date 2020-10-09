import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, ManyToMany, JoinTable, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Point } from "geojson";

import { OperationVolume } from "./OperationVolume";
import { User } from "./User";
import { VehicleReg } from "./VehicleReg";
import { ContingencyPlan } from "./ContingencyPlan";
import { NegotiationAgreement } from "./NegotiationAgreement";
import { PriorityElements } from "./PriorityElements";
// import { OperationIntersections } from "./OperationIntersection";
// import { OperationCanceledException } from "typescript";

type operations_vol = Array<OperationVolume>;

/**
 * 
    PROPOSED
    This operation is not yet ACCEPTED. It may be awaiting information
    from the operator, it may be in conflict with another ACCEPTED or
    ACTIVATED operation and undergoing a negotiation process, or for
    some other reason it is not yet able to be declared ACCEPTED.
    ACCEPTED
    This operation has been deemed ACCEPTED by the supporting USS. This
    implies that the operation meets the requirements for operating in
    the airspace based on the type of operation submitted.
    ACTIVATED
    This operation is active. The transition from ACCEPTED to ACTIVATED
    is not an announced transition. The transition is implied based on
    the submitted start time of the operation (i.e. the
    effective_time_begin of the first OperationVolume). Note that an
    ACTIVATED operation is not necessarily airborne, but is assumed
    to be "using" the OperationVolumes that it has announced.
    CLOSED
    This operation is closed. It is not airborne and will not become
    airborne again. If the UAS and the crew will fly again, it would
    need to be as a new operation. A USS may announce the closure of any
    operation, but is not required to announce unless the operation was
    ROGUE or NONCONFORMING.
    NONCONFORMING
    See USS Specification for requirements to transition to this state.
    ROGUE
    See USS Specification for requirements to transition to this state.
 */
export enum OperationState {
    PROPOSED = "PROPOSED"
    , ACCEPTED = "ACCEPTED"
    , ACTIVATED = "ACTIVATED"
    , CLOSED = "CLOSED"
    , NONCONFORMING = "NONCONFORMING"
    , ROGUE = "ROGUE"
    , NOT_ACCEPTED = "NOT_ACCEPTED"
    , PENDING = "PENDING"
}
export enum OperatonFaaRule {
    PART_107 = "PART_107"
    , PART_107X = "PART_107X"
    , PART_101E = "PART_101E"
    , OTHER = "OTHER"
}

@Entity()
export class Operation {
    @PrimaryGeneratedColumn("uuid")
    'gufi': string;

    // Obligatorio - ya no se usa flight_comments como titulo
    @Column()
    'name': string;

    // Owner - a quien le pertenece la operación
    @ManyToOne(type => User, {
        eager: true
    })
    'owner': User;

    //agregarlos nulleables
    @Column({ nullable: true })
    'uss_name'?: string;
    @Column({ nullable: true })
    'discovery_reference'?: string;

    //automaticos, ignorarlos en la entrada
    @CreateDateColumn({ type: "timestamp" })
    // @Column({ type: "timestamp" })
    'submit_time'?: string;

    // automaticos, ignorarlos en la entrada 
    @UpdateDateColumn({ type: "timestamp" })
    // @Column({ type: "timestamp" })
    'update_time'?: string;

    @Column({ nullable: true })
    'aircraft_comments'?: string;

    //obligatorio, despues de aplicar trim tiene que tener entre 1 y 255. 
    //se usa como frontend como titulo
    @Column({ nullable: true })
    'flight_comments': string;

    @Column({ nullable: true })
    'volumes_description'?: string;

    @Column({ nullable: true })
    'airspace_authorization'?: string;

    @Column({ nullable: true })
    'flight_number'?: string;

    //agregar los comentarios sobre la nueva maquina de estados
    @Column()
    'state': OperationState //"PROPOSED" | "ACCEPTED" | "ACTIVATED" | "CLOSED" | "NONCONFORMING" | "ROGUE";

    @Column("geometry", { nullable: true })
    'controller_location': Point;

    @Column("geometry", { nullable: true })
    'gcs_location'?: Point;

    //nulleable
    @Column({ nullable: true })
    'faa_rule'?: OperatonFaaRule // "PART_107" | "PART_107X" | "PART_101E" | "OTHER";


    //tiene que tener 1 elemento
    @OneToMany(type => OperationVolume, operation_volume => operation_volume.operation, {
        eager: true,
        cascade: true,
    })
    'operation_volumes': OperationVolume[];


    // 'uas_registrations': Array<UasRegistration>;

    //mandar una lista de ids. controlar que existan y sean del usuario. no vacia
    @ManyToMany(type => VehicleReg
        , { eager: true }
    )
    @JoinTable()
    uas_registrations: VehicleReg[];

    //se obtiene automaticamente del token
    @ManyToOne(type => User, {
        eager: false
    })
    'creator': User;

    @Column({ nullable: true })
    'contact'?: string;

    @Column({ nullable: true })
    'contact_phone'?: string;

    //no obligatorio
    @ManyToMany(type => ContingencyPlan
        , { eager: true, cascade: true },
    )
    @JoinTable()
    'contingency_plans': ContingencyPlan[];

    //no obligatorio
    @ManyToMany(type => NegotiationAgreement
        , { eager: true, cascade: true }
    )
    @JoinTable()
    'negotiation_agreements'?: NegotiationAgreement[];


    //nulleable
    @Column(type => PriorityElements)
    // @JoinColumn()
    'priority_elements'?: PriorityElements;


    // @OneToOne("OperationIntersections", { lazy: true, cascade: true })
    // // @JoinColumn()
    // 'operation_inserctions'?: OperationIntersections


    //es nuleable
    // 'metadata': EventMetadata;

    // @AfterLoad()
    // updateCounters() {
    //     if (this.likesCount === undefined)
    //         this.likesCount = 0;
    // }
}


