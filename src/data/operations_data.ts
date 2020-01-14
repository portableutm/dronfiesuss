import { Polygon } from 'geojson';
import { Operation, OperationState, OperatonFaaRule } from "../entities/Operation";
import { OperationVolume } from '../entities/OperationVolume';
import { Severity } from '../entities/Severety';
import { PriorityElements } from '../entities/PriorityElements';
import { ContingencyPlan } from '../entities/ContingencyPlan';
import { NegotiationAgreement } from '../entities/NegotiationAgreement';


let op: Operation = new Operation()
op.flight_comments = "Test operation for rescue"
op.volumes_description = "Simple polygon"
op.flight_number = "12345678"
op.submit_time = "2019-12-11T19:59:10Z"
op.update_time = "2019-12-11T19:59:10Z"
op.faa_rule = OperatonFaaRule.PART_107;
op.state = OperationState.PROPOSED

op.priority_elements = new PriorityElements()
op.priority_elements.priority_level = Severity.ALERT
op.priority_elements.priority_status = "NONE";

op.contingency_plans = new Array <ContingencyPlan>();
let contingency_plan = new ContingencyPlan();
contingency_plan.contingency_cause = ["ENVIRONMENTAL", "LOST_NAV"]
contingency_plan.contingency_location_description = "OPERATOR_UPDATED"
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
contingency_plan.contingency_response = "LANDING"
contingency_plan.free_text = "Texto libre DE prueba"
contingency_plan.loiter_altitude = 30
contingency_plan.relative_preference = 30
contingency_plan.relevant_operation_volumes = [1,0]
contingency_plan.valid_time_begin = "2019-12-11T19:59:10Z"
contingency_plan.valid_time_end = "2019-12-11T20:59:10Z"
op.contingency_plans.push(contingency_plan)

op.priority_elements = new PriorityElements()
op.priority_elements.priority_level = Severity.ALERT
op.priority_elements.priority_status = "EMERGENCY_AIR_AND_GROUND_IMPACT"



op.operation_volumes = new Array < OperationVolume > ();
op.operation_volumes[0] = new OperationVolume()
op.operation_volumes[0].effective_time_begin = "2019-12-11T19:59:10Z"
op.operation_volumes[0].effective_time_end = "2019-12-11T20:59:10Z"
op.operation_volumes[0].min_altitude = 10
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

op.operation_volumes[1] = new OperationVolume()
op.operation_volumes[1].effective_time_begin = "2019-12-11T19:59:10Z"
op.operation_volumes[1].effective_time_end = "2019-12-11T20:59:10Z"
op.operation_volumes[1].min_altitude = 10
op.operation_volumes[1].max_altitude = 70
op.state = OperationState.PROPOSED //"PROPOSED"
const polygons: Polygon = {
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
op.operation_volumes[1].operation_geography = polygons
op.operation_volumes[1].beyond_visual_line_of_sight = true



op.negotiation_agreements = []
op.negotiation_agreements[0] = new NegotiationAgreement()
op.negotiation_agreements[0].free_text = "Esto es solo una prueba"
op.negotiation_agreements[0].discovery_reference = "discovery reference"
op.negotiation_agreements[0].type = "INTERSECTION"
op.negotiation_agreements[0].uss_name = "dronfies"
op.negotiation_agreements[0].uss_name_of_originator = "dronfies"
op.negotiation_agreements[0].uss_name_of_receiver = "dronfies"

op.negotiation_agreements[1] = new NegotiationAgreement()
op.negotiation_agreements[1].free_text = "(2) Esto es solo una prueba"
op.negotiation_agreements[1].discovery_reference = "(2)discovery reference"
op.negotiation_agreements[1].type = "INTERSECTION"
op.negotiation_agreements[1].uss_name = "dronfies"
op.negotiation_agreements[1].uss_name_of_originator = "dronfies"
op.negotiation_agreements[1].uss_name_of_receiver = "dronfies"

console.log(JSON.stringify(op, null, 2))



export let Operations = []
Operations.push(op)
