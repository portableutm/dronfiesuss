import { Polygon } from 'geojson';
import { Operation, OperationState, OperatonFaaRule } from "../entities/Operation";
import { OperationVolume } from '../entities/OperationVolume';
import { Severity } from '../entities/Severety';
import { PriorityElements , PriorityStatus} from '../entities/PriorityElements';
import { ContingencyPlan , ContingencyCause, ContingencyLocationDescription, ContingencyResponse} from '../entities/ContingencyPlan';
import { NegotiationAgreement , NegotiationAgreementType} from '../entities/NegotiationAgreement';

import { deepCopy } from "../utils/entitiesUtils";


let op: Operation = new Operation()
op.gufi = "b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63"
op.name = "Test operation for rescue"
op.volumes_description = "Simple polygon"
op.flight_number = "12345678"
op.submit_time = "2019-12-11T19:59:10Z"
op.update_time = "2019-12-11T19:59:10Z"
op.faa_rule = OperatonFaaRule.PART_107;
op.state = OperationState.PROPOSED

op.priority_elements = new PriorityElements()
op.priority_elements.priority_level = Severity.ALERT
op.priority_elements.priority_status = PriorityStatus.NONE //"NONE";
op.contact = "Renate Penvarden"

op.contingency_plans = new Array <ContingencyPlan>();
let contingency_plan = new ContingencyPlan();
contingency_plan.contingency_cause = [ContingencyCause.ENVIRONMENTAL, ContingencyCause.MECHANICAL_PROBLEM]
contingency_plan.contingency_location_description = ContingencyLocationDescription.OPERATOR_UPDATED // "OPERATOR_UPDATED"
contingency_plan.contingency_polygon = {
    type: "Polygon",
    coordinates: [
        [
            [-56.16361141204833, -34.90682134107926],
            [-56.163225173950195, -34.911255687582056],
            [-56.15453481674194, -34.91389506584019],
            [-56.15406274795532, -34.909020947652444],
            [-56.16361141204833, -34.90682134107926]
        ]
    ]
}
contingency_plan.contingency_response = ContingencyResponse.LANDING // "LANDING"
contingency_plan.free_text = "Texto libre DE prueba"
contingency_plan.loiter_altitude = 30
contingency_plan.relative_preference = 30
contingency_plan.relevant_operation_volumes = [1,0]
contingency_plan.valid_time_begin = "2019-12-11T19:59:10Z"
contingency_plan.valid_time_end = "2019-12-11T20:59:10Z"
op.contingency_plans.push(contingency_plan)

// op.priority_elements = new PriorityElements()
// op.priority_elements.priority_level = Severity.ALERT
// op.priority_elements.priority_status =  "EMERGENCY_AIR_AND_GROUND_IMPACT"



op.operation_volumes = new Array < OperationVolume > ();
op.operation_volumes[0] = new OperationVolume() 
op.operation_volumes[0].effective_time_begin = "2019-12-11T19:59:10Z"
op.operation_volumes[0].effective_time_end = "2019-12-11T20:59:10Z"
op.operation_volumes[0].min_altitude = 0
op.operation_volumes[0].max_altitude = 70
const polygon: Polygon = {
    type: "Polygon",
    coordinates: [
        [
            [-56.16361141204833, -34.90682134107926],
            [-56.163225173950195, -34.911255687582056],
            [-56.15453481674194, -34.91389506584019],
            [-56.15406274795532, -34.909020947652444],
            [-56.16361141204833, -34.90682134107926]
        ]
    ]
};
op.operation_volumes[0].operation_geography = polygon
op.operation_volumes[0].beyond_visual_line_of_sight = true


op.negotiation_agreements = []
op.negotiation_agreements[0] = new NegotiationAgreement()
op.negotiation_agreements[0].free_text = "Esto es solo una prueba"
op.negotiation_agreements[0].discovery_reference = "discovery reference"
op.negotiation_agreements[0].type = NegotiationAgreementType.INTERSECTION // "INTERSECTION"
op.negotiation_agreements[0].uss_name = "dronfies"
op.negotiation_agreements[0].uss_name_of_originator = "dronfies"
op.negotiation_agreements[0].uss_name_of_receiver = "dronfies"

op.negotiation_agreements[1] = new NegotiationAgreement()
op.negotiation_agreements[1].free_text = "(2) Esto es solo una prueba"
op.negotiation_agreements[1].discovery_reference = "(2)discovery reference"
op.negotiation_agreements[1].type = NegotiationAgreementType.REPLAN //"INTERSECTION"
op.negotiation_agreements[1].uss_name = "dronfies"
op.negotiation_agreements[1].uss_name_of_originator = "dronfies"
op.negotiation_agreements[1].uss_name_of_receiver = "dronfies"

// console.log(JSON.stringify(op, null, 2))

let op2 = deepCopy(op)
op2.gufi = "f7891e78-9bb4-431d-94d3-1a506910c254"
op2.name = "Rescue operation on Montevideo"
op2.state = OperationState.ACCEPTED

const polygon2: Polygon = {"type": "Polygon","coordinates": [[[-56.15326881408691,-34.90465687069262],[-56.15541458129883,-34.910217508880926],[-56.14837646484375,-34.910780590483675],[-56.14837646484375,-34.90993596663135],[-56.144514083862305,-34.90662777287992],[-56.15326881408691,-34.90465687069262]]]}
op2.operation_volumes[0].operation_geography = polygon2


let op3 = deepCopy(op)
op3.gufi = "a20ef8d5-506d-4f54-a981-874f6c8bd4de"
op3.name = "Rescuing a dog"
op3.state = OperationState.PROPOSED
op3.operation_volumes[0].operation_geography = {"type": "Polygon", "coordinates": [[[-56.16193771362305,-34.90275631306831],[-56.161251068115234,-34.90662777287992],[-56.154985427856445,-34.906486995721075],[-56.155757904052734,-34.90233396095623],[-56.16193771362305,-34.90275631306831]]]}

let op4 = deepCopy(op)
op4.gufi = "ff4b6505-c282-42b1-b013-66f02137f5d5"
op4.name = "Rescuing a Cat"
op4.state = OperationState.PROPOSED
op4.operation_volumes[0].operation_geography = {"type": "Polygon","coordinates": [[[-56.15326881408691,-34.899940591293],[-56.15386962890625,-34.90409374709326],[-56.14768981933594,-34.90367140185956],[-56.15086555480957,-34.90036295571346],[-56.15326881408691,-34.899940591293]]]}



export let Operations = []
Operations.push(op)
Operations.push(op2)
Operations.push(op3)
Operations.push(op4)




