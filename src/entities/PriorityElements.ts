import { Severity } from "./Severety";
import { Column } from "typeorm";

export enum PriorityStatus {
    NONE = "NONE" 
    , PUBLIC_SAFETY = "PUBLIC_SAFETY" 
    , EMERGENCY_AIRBORNE_IMPACT = "EMERGENCY_AIRBORNE_IMPACT" 
    , EMERGENCY_GROUND_IMPACT = "EMERGENCY_GROUND_IMPACT" 
    , EMERGENCY_AIR_AND_GROUND_IMPACT = "EMERGENCY_AIR_AND_GROUND_IMPACT"
}

export class PriorityElements {
    @Column()
    'priority_level': Severity;
    @Column()
    'priority_status': PriorityStatus //"NONE" | "PUBLIC_SAFETY" | "EMERGENCY_AIRBORNE_IMPACT" | "EMERGENCY_GROUND_IMPACT" | "EMERGENCY_AIR_AND_GROUND_IMPACT";
}