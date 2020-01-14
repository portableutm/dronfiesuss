import { Severity } from "./Severety";
import { Column } from "typeorm";


export class PriorityElements {
    @Column()
    'priority_level': Severity;
    @Column()
    'priority_status': "NONE" | "PUBLIC_SAFETY" | "EMERGENCY_AIRBORNE_IMPACT" | "EMERGENCY_GROUND_IMPACT" | "EMERGENCY_AIR_AND_GROUND_IMPACT";
}