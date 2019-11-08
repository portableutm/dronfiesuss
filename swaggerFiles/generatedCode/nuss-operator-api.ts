// tslint:disable

/// <reference path="../../typings/tsd.d.ts" />

import * as request from "superagent";
import {
    SuperAgentStatic,
    SuperAgentRequest,
    Response
} from "superagent";

export type RequestHeaders = {
    [header: string]: string;
}
export type RequestHeadersHandler = (headers: RequestHeaders) => RequestHeaders;

export type ConfigureAgentHandler = (agent: SuperAgentStatic) => SuperAgentStatic;

export type ConfigureRequestHandler = (agent: SuperAgentRequest) => SuperAgentRequest;

export type CallbackHandler = (err: any, res ? : request.Response) => void;

export type Violation = {
    'constraining_id' ? : string;
    'constraining_ids' ? : Array < string >
    ;
    'constraining_volume' ? : number;
    'problemReport' ? : string;
    'type': string;
    'violating_volume' ? : number;
} & {
    [key: string]: any;
};

export type InformMsgType = {
    'ack_time' ? : string;
    'disclaimer' ? : string;
    'free_text' ? : string;
    'gufi': string;
    'inform_message' ? : "UNKWN" | "ACTIVATED" | "CLOSED" | "CANCELED" | "ACCEPTED" | "REJECTED" | "NONCONFORMING" | "EXPIRED" | "OP_NOT_SUCCESSFUL" | "NOT_ACTIVATED" | "ROGUE" | "ROGUECLOSED" | "ABORTING" | "ABORTCLOSED" | "CREATE_SUCCESS" | "CREATE_FAIL" | "UPDATE_SUCCESS" | "UPDATE_FAIL" | "INVALIDATED";
    'message_id' ? : string;
    'origin' ? : "CLIENT" | "UTM" | "MANAGER";
    'reason' ? : string;
    'sent_time' ? : string;
    'surveillance_operation_id' ? : string;
    'user' ? : string;
    'violations' ? : Array < Violation >
    ;
    'warning_region_id' ? : string;
    'warnings' ? : Array < Warning >
    ;
} & {
    [key: string]: any;
};

export type Warning = {
    'message' ? : string;
    'type': "Obstacles" | "Tfr" | "Decision";
    'warning_ids' ? : Array < string >
    ;
} & {
    [key: string]: any;
};

export type Message = {
    'ack_time' ? : string;
    'free_text' ? : string;
    'gufi': string;
    'message_id' ? : string;
    'origin' ? : "CLIENT" | "UTM" | "MANAGER";
    'sent_time' ? : string;
    'surveillance_operation_id' ? : string;
    'user' ? : string;
    'warning_region_id' ? : string;
    'category' ? : string;
} & {
    [key: string]: any;
};

export type FreeMsgType = {
    'ack_time' ? : string;
    'free_text' ? : string;
    'gufi': string;
    'message_id' ? : string;
    'origin' ? : "CLIENT" | "UTM" | "MANAGER";
    'sent_time' ? : string;
    'surveillance_operation_id' ? : string;
    'user' ? : string;
    'warning_region_id' ? : string;
} & {
    [key: string]: any;
};

export type Operation = {
    'aircraft_comments' ? : string;
    'aircraft_type' ? : string;
    'color_markings' ? : string;
    'conformance_time_begin' ? : string;
    'conformance_time_end' ? : string;
    'created_by' ? : string;
    'decision_time' ? : string;
    'effective_time_begin' ? : string;
    'effective_time_end' ? : string;
    'extra_contact_info' ? : string;
    'flight_comments' ? : string;
    'flight_geography_description' ? : string;
    'flight_number' ? : string;
    'gufi' ? : string;
    'operation_volumes': Array < OperationVolume >
    ;
    'primary_contact_email': string;
    'primary_contact_name': string;
    'primary_contact_phone': string;
    'protected_time_begin' ? : string;
    'protected_time_end' ? : string;
    'registration_detail' ? : string;
    'registration': string;
    'secondary_contact_email' ? : string;
    'secondary_contact_name' ? : string;
    'secondary_contact_phone' ? : string;
    'state' ? : "P" | "A" | "R" | "C" | "X" | "I" | "E" | "G" | "B" | "U" | "T" | "F" | "V";
    'submit_time' ? : string;
    'unmanned': boolean;
    'user_id': string;
    'controller_location' ? : Point;
    'gcs_location' ? : Point;
    'faa_rule' ? : "PART_107" | "PART_107W" | "PART_101E" | "PART_TBD";
    'waiver_certificate_number' ? : string;
    'priority_op' ? : boolean;
} & {
    [key: string]: any;
};

export type Polygon = {
    'coordinates': Array < Array < Array < number >
        >
        >
    ;
} & {
    [key: string]: any;
};

export type AlertMsgType = {
    'ack_time' ? : string;
    'alert_message' ? : "UNKWN" | "LOST_COMM_AND_CONTROL" | "WEATHER" | "SECURITY" | "OPERATIONS" | "SYSTEM";
    'alert_severity' ? : "UNKWN" | "INFORMATIONAL" | "NOTICE" | "WARNING" | "CRITICAL" | "EMERGENCY";
    'free_text' ? : string;
    'gufi': string;
    'message_id' ? : string;
    'origin' ? : "CLIENT" | "UTM" | "MANAGER";
    'sent_time' ? : string;
    'surveillance_operation_id' ? : string;
    'user' ? : string;
    'warning_region_id' ? : string;
    'warnings' ? : Array < Warning >
    ;
} & {
    [key: string]: any;
};

export type UTMRestResponse = {
    'http_status_code' ? : string;
    'msg' ? : string;
    'uri' ? : string;
    'url' ? : string;
    'violationMap' ? : {} & {
        [key: string]: any;
    };
} & {
    [key: string]: any;
};

export type Position = {
    'air_speed_source' ? : string;
    'air_speed_track_kn' ? : number;
    'altitude_gps_wgs84_ft': number;
    'altitude_num_gps_satellites': number;
    'enroute_positions_id' ? : string;
    'gufi': string;
    'hdop_gps': number;
    'location': Point;
    'time_measured': string;
    'time_received' ? : string;
    'time_sent': string;
    'track_ground_speed_kn': number;
    'track_magnetic_north_deg' ? : number;
    'track_true_north_deg': number;
    'user_id' ? : string;
    'vdop_gps': number;
} & {
    [key: string]: any;
};

export type OperationVolume = {
    'actual_time_end' ? : string;
    'conformance_geography' ? : Polygon;
    'conformance_time_begin' ? : string;
    'conformance_time_end' ? : string;
    'effective_time_begin': string;
    'effective_time_end': string;
    'flight_geography': Polygon;
    'gufi' ? : string;
    'id' ? : string;
    'line_of_sight': boolean;
    'max_altitude_conform_wgs84_ft' ? : number;
    'max_altitude_protected_wgs84_ft' ? : number;
    'max_altitude_wgs84_ft': number;
    'min_altitude_conform_wgs84_ft' ? : number;
    'min_altitude_protected_wgs84_ft' ? : number;
    'min_altitude_wgs84_ft': number;
    'near_structure' ? : boolean;
    'ordinal': number;
    'protected_geography' ? : Polygon;
    'protected_time_begin' ? : string;
    'protected_time_end' ? : string;
} & {
    [key: string]: any;
};

export type Point = {
    'coordinates': Array < number >
    ;
    'type' ? : string;
} & {
    [key: string]: any;
};

export type IntentMsgType = {
    'ack_time' ? : string;
    'free_text' ? : string;
    'gufi': string;
    'intent_message': "UNKWN" | "ALL_CLEAR" | "CLOSE" | "CANCEL" | "ABORT";
    'message_id' ? : string;
    'origin' ? : "CLIENT" | "UTM" | "MANAGER";
    'sent_time' ? : string;
    'surveillance_operation_id' ? : string;
    'user' ? : string;
    'warning_region_id' ? : string;
} & {
    [key: string]: any;
};

export type Response_getMessages_200 = Array < Message >
;

export type Response_getMessagesByGufi_200 = Array < Message >
;

export type Response_getOperations_200 = Array < Operation >
;

export type Response_getPositions_200 = Array < Position >
;

export type Logger = {
    log: (line: string) => any
};

export interface ResponseWithBody < S extends number, T > extends Response {
    status: S;
    body: T;
}

export type QueryParameters = {
    [param: string]: any
};

export interface CommonRequestOptions {
    $queryParameters ? : QueryParameters;
    $domain ? : string;
    $path ? : string | ((path: string) => string);
    $retries ? : number; // number of retries; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#retrying-requests
    $timeout ? : number; // request timeout in milliseconds; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
    $deadline ? : number; // request deadline in milliseconds; see: https://github.com/visionmedia/superagent/blob/master/docs/index.md#timeouts
}

/**
 * Manage Operator Operations.
For GETTERs with query parameters, the parameter names must be lower case, however string parmeter values are case insensitive.

Example of the GET-list using time window:
/messages/?sent_time_after=2038-01-01T07:58:20.000Z&sent_time_before=2038-01-01T07:58:30.000Z

(todo) GET-list for Positions is not yet in.
(todo) GET-list returns an empty list if nothing is found. GET-by-gufi returns 404 if the item is not found.
 * @class nuss_operator_api
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export class nuss_operator_api {

    private domain: string = "https://some.host/operator";
    private errorHandlers: CallbackHandler[] = [];
    private requestHeadersHandler ? : RequestHeadersHandler;
    private configureAgentHandler ? : ConfigureAgentHandler;
    private configureRequestHandler ? : ConfigureRequestHandler;

    constructor(domain ? : string, private logger ? : Logger) {
        if (domain) {
            this.domain = domain;
        }
    }

    getDomain() {
        return this.domain;
    }

    addErrorHandler(handler: CallbackHandler) {
        this.errorHandlers.push(handler);
    }

    setRequestHeadersHandler(handler: RequestHeadersHandler) {
        this.requestHeadersHandler = handler;
    }

    setConfigureAgentHandler(handler: ConfigureAgentHandler) {
        this.configureAgentHandler = handler;
    }

    setConfigureRequestHandler(handler: ConfigureRequestHandler) {
        this.configureRequestHandler = handler;
    }

    private request(method: string, url: string, body: any, headers: RequestHeaders, queryParameters: QueryParameters, form: any, reject: CallbackHandler, resolve: CallbackHandler, opts: CommonRequestOptions) {
        if (this.logger) {
            this.logger.log(`Call ${method} ${url}`);
        }

        const agent = this.configureAgentHandler ?
            this.configureAgentHandler(request.default) :
            request.default;

        let req = agent(method, url);
        if (this.configureRequestHandler) {
            req = this.configureRequestHandler(req);
        }

        req = req.query(queryParameters);

        if (body) {
            req.send(body);

            if (typeof(body) === 'object' && !(body.constructor.name === 'Buffer')) {
                headers['Content-Type'] = 'application/json';
            }
        }

        if (Object.keys(form).length > 0) {
            req.type('form');
            req.send(form);
        }

        if (this.requestHeadersHandler) {
            headers = this.requestHeadersHandler({
                ...headers
            });
        }

        req.set(headers);

        if (opts.$retries && opts.$retries > 0) {
            req.retry(opts.$retries);
        }

        if (opts.$timeout && opts.$timeout > 0 || opts.$deadline && opts.$deadline > 0) {
            req.timeout({
                deadline: opts.$deadline,
                response: opts.$timeout
            });
        }

        req.end((error, response) => {
            // an error will also be emitted for a 4xx and 5xx status code
            // the error object will then have error.status and error.response fields
            // see superagent error handling: https://github.com/visionmedia/superagent/blob/master/docs/index.md#error-handling
            if (error) {
                reject(error);
                this.errorHandlers.forEach(handler => handler(error));
            } else {
                resolve(response);
            }
        });
    }

    getMessagesURL(parameters: {
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
        'sentTimeBefore' ? : string,
        'sentTimeAfter' ? : string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/messages';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters['sentTimeBefore'] !== undefined) {
            queryParameters['sent_time_before'] = parameters['sentTimeBefore'];
        }

        if (parameters['sentTimeAfter'] !== undefined) {
            queryParameters['sent_time_after'] = parameters['sentTimeAfter'];
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * You can specify ASC and DESC (or asc/desc) as follows: /operator/messages?sort=DESC You can specify a time window as follows: /operator/messages/?limit=44&sent_time_after=2038-01-01T07:58:20.000Z&sent_time_before=2038-01-01T07:58:30.000Z 
     * @method
     * @name nuss_operator_api#getMessages
     * @param {string} sort - sort
     * @param {integer} limit - limit
     * @param {integer} offset - offset
     * @param {string} sentTimeBefore - Returns Message with sent_time before or equal to the given time
     * @param {string} sentTimeAfter - Returns Messages with sent_time after or equal to the given time
     */
    getMessages(parameters: {
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
        'sentTimeBefore' ? : string,
        'sentTimeAfter' ? : string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_getMessages_200 > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/messages';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters['sort'] !== undefined) {
                queryParameters['sort'] = parameters['sort'];
            }

            if (parameters['limit'] !== undefined) {
                queryParameters['limit'] = parameters['limit'];
            }

            if (parameters['offset'] !== undefined) {
                queryParameters['offset'] = parameters['offset'];
            }

            if (parameters['sentTimeBefore'] !== undefined) {
                queryParameters['sent_time_before'] = parameters['sentTimeBefore'];
            }

            if (parameters['sentTimeAfter'] !== undefined) {
                queryParameters['sent_time_after'] = parameters['sentTimeAfter'];
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postMessagesURL(parameters: {
        'msg': Message,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/messages';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * add Message for a Gufi
     * @method
     * @name nuss_operator_api#postMessages
     * @param {} msg - msg
     */
    postMessages(parameters: {
        'msg': Message,
    } & CommonRequestOptions): Promise < ResponseWithBody < 201, UTMRestResponse > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/messages';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters['msg'] !== undefined) {
                body = parameters['msg'];
            }

            if (parameters['msg'] === undefined) {
                reject(new Error('Missing required  parameter: msg'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getMessagesByGufiURL(parameters: {
        'gufi': string,
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/messages/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{gufi}', `${encodeURIComponent(parameters['gufi'].toString())}`);
        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * get Messages for a Gufi
     * @method
     * @name nuss_operator_api#getMessagesByGufi
     * @param {string} gufi - gufi
     * @param {string} sort - sort
     * @param {integer} limit - limit
     * @param {integer} offset - offset
     */
    getMessagesByGufi(parameters: {
        'gufi': string,
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_getMessagesByGufi_200 > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/messages/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            path = path.replace('{gufi}', `${encodeURIComponent(parameters['gufi'].toString())}`);

            if (parameters['gufi'] === undefined) {
                reject(new Error('Missing required  parameter: gufi'));
                return;
            }

            if (parameters['sort'] !== undefined) {
                queryParameters['sort'] = parameters['sort'];
            }

            if (parameters['limit'] !== undefined) {
                queryParameters['limit'] = parameters['limit'];
            }

            if (parameters['offset'] !== undefined) {
                queryParameters['offset'] = parameters['offset'];
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getOperationsURL(parameters: {
        'state' ? : Array < string >
            ,
        'stateNotEq' ? : Array < string >
            ,
        'effectiveTimeBeginBefore' ? : string,
        'effectiveTimeBeginAfter' ? : string,
        'effectiveTimeEndBefore' ? : string,
        'effectiveTimeEndAfter' ? : string,
        'insideBbox' ? : Array < number >
            ,
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters['state'] !== undefined) {
            queryParameters['state'] = parameters['state'];
        }

        if (parameters['stateNotEq'] !== undefined) {
            queryParameters['state_not_eq'] = parameters['stateNotEq'];
        }

        if (parameters['effectiveTimeBeginBefore'] !== undefined) {
            queryParameters['effective_time_begin_before'] = parameters['effectiveTimeBeginBefore'];
        }

        if (parameters['effectiveTimeBeginAfter'] !== undefined) {
            queryParameters['effective_time_begin_after'] = parameters['effectiveTimeBeginAfter'];
        }

        if (parameters['effectiveTimeEndBefore'] !== undefined) {
            queryParameters['effective_time_end_before'] = parameters['effectiveTimeEndBefore'];
        }

        if (parameters['effectiveTimeEndAfter'] !== undefined) {
            queryParameters['effective_time_end_after'] = parameters['effectiveTimeEndAfter'];
        }

        if (parameters['insideBbox'] !== undefined) {
            queryParameters['inside_bbox'] = parameters['insideBbox'];
        }

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
    * GET operation list with query
    * @method
    * @name nuss_operator_api#getOperations
         * @param {array} state - You can specify ASC and DESC (or asc/desc) as follows: https://host.nasa.gov/nuss/operator/messages?sort=DESC
You can also specify limit and offset.
Returns Operations with an OR list given states. Eg. state=A,V returns operations in A or V states. Cannot use with state_not_eq.
         * @param {array} stateNotEq - Returns Operations with other than the given states. Eg state_not_eq=X,C. Cannot use with state.
         * @param {string} effectiveTimeBeginBefore - Returns Operations with effective_begin_time before or equal to the given time
         * @param {string} effectiveTimeBeginAfter - Returns Operations with effective_begin_time after or equal to the given time
         * @param {string} effectiveTimeEndBefore - Returns Operations with effective_end_time before or equal to the given time
         * @param {string} effectiveTimeEndAfter - Returns Operations with effective_end_time after or equal to the given time
         * @param {array} insideBbox - Returns Operations with flight geographies inside or intersecting the bbox. The coordinates are comma delimited (lon_min,lat_min,lon_max,lat_max). Example: -121.1133,36.5317,-121.0941,36.6530
         * @param {string} sort - sorts the results by submit_time. Valid values - asc, desc. Default value is desc.
         * @param {integer} limit - limit
         * @param {integer} offset - offset
    */
    getOperations(parameters: {
        'state' ? : Array < string >
            ,
        'stateNotEq' ? : Array < string >
            ,
        'effectiveTimeBeginBefore' ? : string,
        'effectiveTimeBeginAfter' ? : string,
        'effectiveTimeEndBefore' ? : string,
        'effectiveTimeEndAfter' ? : string,
        'insideBbox' ? : Array < number >
            ,
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_getOperations_200 > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters['state'] !== undefined) {
                queryParameters['state'] = parameters['state'];
            }

            if (parameters['stateNotEq'] !== undefined) {
                queryParameters['state_not_eq'] = parameters['stateNotEq'];
            }

            if (parameters['effectiveTimeBeginBefore'] !== undefined) {
                queryParameters['effective_time_begin_before'] = parameters['effectiveTimeBeginBefore'];
            }

            if (parameters['effectiveTimeBeginAfter'] !== undefined) {
                queryParameters['effective_time_begin_after'] = parameters['effectiveTimeBeginAfter'];
            }

            if (parameters['effectiveTimeEndBefore'] !== undefined) {
                queryParameters['effective_time_end_before'] = parameters['effectiveTimeEndBefore'];
            }

            if (parameters['effectiveTimeEndAfter'] !== undefined) {
                queryParameters['effective_time_end_after'] = parameters['effectiveTimeEndAfter'];
            }

            if (parameters['insideBbox'] !== undefined) {
                queryParameters['inside_bbox'] = parameters['insideBbox'];
            }

            if (parameters['sort'] !== undefined) {
                queryParameters['sort'] = parameters['sort'];
            }

            if (parameters['limit'] !== undefined) {
                queryParameters['limit'] = parameters['limit'];
            }

            if (parameters['offset'] !== undefined) {
                queryParameters['offset'] = parameters['offset'];
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postOperationsURL(parameters: {
        'model': Operation,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * add an operation
     * @method
     * @name nuss_operator_api#postOperations
     * @param {} model - model
     */
    postOperations(parameters: {
        'model': Operation,
    } & CommonRequestOptions): Promise < ResponseWithBody < 201, UTMRestResponse > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters['model'] !== undefined) {
                body = parameters['model'];
            }

            if (parameters['model'] === undefined) {
                reject(new Error('Missing required  parameter: model'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getOperationsByGufiURL(parameters: {
        'gufi': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{gufi}', `${encodeURIComponent(parameters['gufi'].toString())}`);

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * view operation by GUFI
     * @method
     * @name nuss_operator_api#getOperationsByGufi
     * @param {string} gufi - GUFI of the operation being requested.
     */
    getOperationsByGufi(parameters: {
        'gufi': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Operation > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            path = path.replace('{gufi}', `${encodeURIComponent(parameters['gufi'].toString())}`);

            if (parameters['gufi'] === undefined) {
                reject(new Error('Missing required  parameter: gufi'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    putOperationsByGufiURL(parameters: {
        'modifiedOp': Operation,
        'gufi': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{gufi}', `${encodeURIComponent(parameters['gufi'].toString())}`);

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * modify an operation
     * @method
     * @name nuss_operator_api#putOperationsByGufi
     * @param {} modifiedOp - modifiedOp
     * @param {string} gufi - gufi
     */
    putOperationsByGufi(parameters: {
        'modifiedOp': Operation,
        'gufi': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, UTMRestResponse > | ResponseWithBody < 201, void > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters['modifiedOp'] !== undefined) {
                body = parameters['modifiedOp'];
            }

            if (parameters['modifiedOp'] === undefined) {
                reject(new Error('Missing required  parameter: modifiedOp'));
                return;
            }

            path = path.replace('{gufi}', `${encodeURIComponent(parameters['gufi'].toString())}`);

            if (parameters['gufi'] === undefined) {
                reject(new Error('Missing required  parameter: gufi'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getPositionsURL(parameters: {
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/positions';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * You can specify ASC and DESC (or asc/desc) as follows: https://host.nasa.gov/nuss/operator/positions?sort=DESC You can also specify limit and offset. 
     * @method
     * @name nuss_operator_api#getPositions
     * @param {string} sort - sort
     * @param {integer} limit - limit
     * @param {integer} offset - offset
     */
    getPositions(parameters: {
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_getPositions_200 > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/positions';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters['sort'] !== undefined) {
                queryParameters['sort'] = parameters['sort'];
            }

            if (parameters['limit'] !== undefined) {
                queryParameters['limit'] = parameters['limit'];
            }

            if (parameters['offset'] !== undefined) {
                queryParameters['offset'] = parameters['offset'];
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    postPositionsURL(parameters: {
        'pos': Position,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/positions';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        queryParameters = {};

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * addPosition
     * @method
     * @name nuss_operator_api#postPositions
     * @param {} pos - pos
     */
    postPositions(parameters: {
        'pos': Position,
    } & CommonRequestOptions): Promise < ResponseWithBody < 201, UTMRestResponse > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/positions';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters['pos'] !== undefined) {
                body = parameters['pos'];
            }

            if (parameters['pos'] === undefined) {
                reject(new Error('Missing required  parameter: pos'));
                return;
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            form = queryParameters;
            queryParameters = {};

            this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getPositionsByGufiURL(parameters: {
        'gufi': string,
        'fields' ? : string,
        'q' ? : string,
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/positions/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{gufi}', `${encodeURIComponent(parameters['gufi'].toString())}`);
        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters['q'] !== undefined) {
            queryParameters['q'] = parameters['q'];
        }

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['offset'] !== undefined) {
            queryParameters['offset'] = parameters['offset'];
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * getPositionsForGufi
     * @method
     * @name nuss_operator_api#getPositionsByGufi
     * @param {string} gufi - gufi
     * @param {string} fields - fields
     * @param {string} q - q
     * @param {string} sort - sort
     * @param {integer} limit - limit
     * @param {integer} offset - offset
     */
    getPositionsByGufi(parameters: {
        'gufi': string,
        'fields' ? : string,
        'q' ? : string,
        'sort' ? : string,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Position > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/positions/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            path = path.replace('{gufi}', `${encodeURIComponent(parameters['gufi'].toString())}`);

            if (parameters['gufi'] === undefined) {
                reject(new Error('Missing required  parameter: gufi'));
                return;
            }

            if (parameters['fields'] !== undefined) {
                queryParameters['fields'] = parameters['fields'];
            }

            if (parameters['q'] !== undefined) {
                queryParameters['q'] = parameters['q'];
            }

            if (parameters['sort'] !== undefined) {
                queryParameters['sort'] = parameters['sort'];
            }

            if (parameters['limit'] !== undefined) {
                queryParameters['limit'] = parameters['limit'];
            }

            if (parameters['offset'] !== undefined) {
                queryParameters['offset'] = parameters['offset'];
            }

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getSchemaAlertMsgTypeURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/AlertMsgType';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Alerts to clients and UTM Managers
     * @method
     * @name nuss_operator_api#getSchemaAlertMsgType
     */
    getSchemaAlertMsgType(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, AlertMsgType > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/AlertMsgType';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getSchemaFreeMsgTypeURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/FreeMsgType';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * free text
     * @method
     * @name nuss_operator_api#getSchemaFreeMsgType
     */
    getSchemaFreeMsgType(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, FreeMsgType > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/FreeMsgType';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getSchemaInformMsgTypeURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/InformMsgType';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * This is UTM's reply to an Intent. A message with origin CLIENT may not send Inform messages
     * @method
     * @name nuss_operator_api#getSchemaInformMsgType
     */
    getSchemaInformMsgType(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, InformMsgType > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/InformMsgType';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getSchemaIntentMsgTypeURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/IntentMsgType';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Your Intent generates a UTM Inform
     * @method
     * @name nuss_operator_api#getSchemaIntentMsgType
     */
    getSchemaIntentMsgType(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, IntentMsgType > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/IntentMsgType';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getSchemaPointURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/Point';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Point geojson
     * @method
     * @name nuss_operator_api#getSchemaPoint
     */
    getSchemaPoint(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, Point > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/Point';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getSchemaPolygonURL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/Polygon';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
     * Polygon geojson
     * @method
     * @name nuss_operator_api#getSchemaPolygon
     */
    getSchemaPolygon(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 200, Polygon > | ResponseWithBody < 401, void > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/schema/Polygon';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/json';

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

    getUserUsernameUtmMsgV1URL(parameters: {} & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/<username>/utmMsg/v1';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters.$queryParameters) {
            queryParameters = {
                ...queryParameters,
                ...parameters.$queryParameters
            };
        }

        let keys = Object.keys(queryParameters);
        return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')) : '');
    }

    /**
    * Provides InformMessage data related to the specified operator's operations. For example, after an operator POSTs an operation to the /operations  endpoint, that operator will receive InformMessage ACCEPTED or REJECTED.  The connection URL is wss://{host}/uss/NotificationProvider/utm

    * @method
    * @name nuss_operator_api#getUserUsernameUtmMsgV1
    */
    getUserUsernameUtmMsgV1(parameters: {} & CommonRequestOptions): Promise < ResponseWithBody < 410, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/user/<username>/utmMsg/v1';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {

            if (parameters.$queryParameters) {
                queryParameters = {
                    ...queryParameters,
                    ...parameters.$queryParameters
                };
            }

            this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve, parameters);
        });
    }

}

export default nuss_operator_api;