import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import { Point } from "geojson";

import { OperationVolume } from "./OperationVolume";


@Entity()
export class Operation {
    @PrimaryGeneratedColumn("uuid")
    'gufi': string;
    'uss_name': string;
    'discovery_reference'?: string;
    'submit_time': string;
    'update_time': string;
    'aircraft_comments'?: string;
    @Column()
    'flight_comments'?: string;
    @Column()
    'volumes_description'?: string;
    // 'uas_registrations': Array<UasRegistration>;
    'airspace_authorization'?: string;
    @Column()
    'flight_number'?: string;
    // 'contact': PersonOrOrganization;
    'state': "PROPOSED" | "ACCEPTED" | "ACTIVATED" | "CLOSED" | "NONCONFORMING" | "ROGUE";
    'controller_location': Point;
    'gcs_location'?: Point;
    // 'contingency_plans': Array<ContingencyPlan>;
    // 'negotiation_agreements'?: Array<NegotiationAgreement>;
    'faa_rule': "PART_107" | "PART_107X" | "PART_101E" | "OTHER";
    // 'priority_elements'?: PriorityElements;

    @Column(type => OperationVolume)
    'operation_volume': OperationVolume;
    
    // 'operation_volumes': Array<OperationVolume>;
    // 'metadata': EventMetadata;
}
