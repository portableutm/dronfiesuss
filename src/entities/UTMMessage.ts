import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Operation } from "./Operation";
import { Severity } from "./Severety";

export { Severity } from "./Severety";

@Entity()
export class UTMMessage {
    @PrimaryGeneratedColumn("uuid")
    message_id?: string;
    @Column()
    uss_name: string;

    @Column({nullable:true})
    discovery_reference?: string;
    
    @ManyToOne(type => Operation)
    operation? : Operation;

    gufi?: string;

    @Column({type: "timestamp"})
    time_sent: string;

    @Column()
    severity: Severity;

    @Column()
    message_type: "UNPLANNED_LANDING" | "UNCONTROLLED_LANDING" | "OPERATION_NONCONFORMING" | "OPERATION_ROGUE" | "OPERATION_CONFORMING" | "OPERATION_CLOSED" | "CONTINGENCY_PLAN_INITIATED" | "CONTINGENCY_PLAN_CANCELLED" | "PERIODIC_POSITION_REPORTS_START" | "PERIODIC_POSITION_REPORTS_END" | "UNAUTHORIZED_AIRSPACE_PROXIMITY" | "UNAUTHORIZED_AIRSPACE_ENTRY" | "OTHER_SEE_FREE_TEXT";
    // last_known_position?: Position;
    // contingency?: ContingencyPlan;
    @Column({nullable:true})
    prev_message_id?: string;
    @Column()
    free_text?: string;
    // @Column()
    callback?: string;
}

