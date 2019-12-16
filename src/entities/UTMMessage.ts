import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class UTMMessage {
    @PrimaryGeneratedColumn("uuid")
    message_id: string;
    @Column()
    uss_name: string;
    @Column()
    discovery_reference?: string;
    gufi?: string;
    time_sent: string;
    // severity: severity;
    @Column()
    message_type: "UNPLANNED_LANDING" | "UNCONTROLLED_LANDING" | "OPERATION_NONCONFORMING" | "OPERATION_ROGUE" | "OPERATION_CONFORMING" | "OPERATION_CLOSED" | "CONTINGENCY_PLAN_INITIATED" | "CONTINGENCY_PLAN_CANCELLED" | "PERIODIC_POSITION_REPORTS_START" | "PERIODIC_POSITION_REPORTS_END" | "UNAUTHORIZED_AIRSPACE_PROXIMITY" | "UNAUTHORIZED_AIRSPACE_ENTRY" | "OTHER_SEE_FREE_TEXT";
    // last_known_position?: Position;
    // contingency?: ContingencyPlan;
    prev_message_id?: string;
    free_text?: string;
    callback: string;
}
