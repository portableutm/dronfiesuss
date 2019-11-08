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

export type Response_getOperations_200 = Array < Operation >
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
 * This API describes the minimum interface that a USS must implement to  be part of the USS Network.  This API allows for communication of data  between USS Instances and from FIMS to a USS regarding new USS Instances.
 * @class uss_api
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export class uss_api {

    private domain: string = "https://uss.defined.url";
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

    putUvrsByMessageIdURL(parameters: {
        'messageId': string,
        'constraintMessage': UASVolumeReservation,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uvrs/{message_id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{message_id}', `${encodeURIComponent(parameters['messageId'].toString())}`);

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
    * Allow UAS Volume Reservations (UVRs) to be submitted from authorized entities. For validation purposes:
  {message_id} in path == UASVolumeReservation.message_id of body data
    * @method
    * @name uss_api#putUvrsByMessageId
         * @param {string} messageId - PUT by message_id
         * @param {} constraintMessage - The UASVolumeReservation being sent
    */
    putUvrsByMessageId(parameters: {
        'messageId': string,
        'constraintMessage': UASVolumeReservation,
    } & CommonRequestOptions): Promise < ResponseWithBody < 204, void > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uvrs/{message_id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Content-Type'] = 'application/json';

            path = path.replace('{message_id}', `${encodeURIComponent(parameters['messageId'].toString())}`);

            if (parameters['messageId'] === undefined) {
                reject(new Error('Missing required  parameter: messageId'));
                return;
            }

            if (parameters['constraintMessage'] !== undefined) {
                body = parameters['constraintMessage'];
            }

            if (parameters['constraintMessage'] === undefined) {
                reject(new Error('Missing required  parameter: constraintMessage'));
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

    putUtmMessagesByMessageIdURL(parameters: {
        'messageId': string,
        'utmMessage': UTMMessage,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/utm_messages/{message_id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{message_id}', `${encodeURIComponent(parameters['messageId'].toString())}`);

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
    * Allows another USS or FIMS to PUT a message to this USS. For validation purposes:
  {message_id} in path == UTMMessage.message_id of body data
    * @method
    * @name uss_api#putUtmMessagesByMessageId
         * @param {string} messageId - PUT by message_id
         * @param {} utmMessage - The UTMMessage being sent
    */
    putUtmMessagesByMessageId(parameters: {
        'messageId': string,
        'utmMessage': UTMMessage,
    } & CommonRequestOptions): Promise < ResponseWithBody < 204, void > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/utm_messages/{message_id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Content-Type'] = 'application/json';

            path = path.replace('{message_id}', `${encodeURIComponent(parameters['messageId'].toString())}`);

            if (parameters['messageId'] === undefined) {
                reject(new Error('Missing required  parameter: messageId'));
                return;
            }

            if (parameters['utmMessage'] !== undefined) {
                body = parameters['utmMessage'];
            }

            if (parameters['utmMessage'] === undefined) {
                reject(new Error('Missing required  parameter: utmMessage'));
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

    putUssByUssInstanceIdURL(parameters: {
        'ussInstanceId': string,
        'ussInstance': UssInstance,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uss/{uss_instance_id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{uss_instance_id}', `${encodeURIComponent(parameters['ussInstanceId'].toString())}`);

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
    * As per the USS Discovery Service specification, this endpoint is for receiving messages about the USS Network from the USS Discovery Service.  For example, when a new USS Instance is registered, that announcement would come to this endpoint.
For validation purposes:
  {uss_instance_id} in path == UssInstance.uss_instance_id of body data
    * @method
    * @name uss_api#putUssByUssInstanceId
         * @param {string} ussInstanceId - PUT by uss_instance_id
         * @param {} ussInstance - The USS Instance information being sent
    */
    putUssByUssInstanceId(parameters: {
        'ussInstanceId': string,
        'ussInstance': UssInstance,
    } & CommonRequestOptions): Promise < ResponseWithBody < 204, void > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uss/{uss_instance_id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Content-Type'] = 'application/json';

            path = path.replace('{uss_instance_id}', `${encodeURIComponent(parameters['ussInstanceId'].toString())}`);

            if (parameters['ussInstanceId'] === undefined) {
                reject(new Error('Missing required  parameter: ussInstanceId'));
                return;
            }

            if (parameters['ussInstance'] !== undefined) {
                body = parameters['ussInstance'];
            }

            if (parameters['ussInstance'] === undefined) {
                reject(new Error('Missing required  parameter: ussInstance'));
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

    putNegotiationsByMessageIdURL(parameters: {
        'messageId': string,
        'negotiationMessage': NegotiationMessage,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/negotiations/{message_id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{message_id}', `${encodeURIComponent(parameters['messageId'].toString())}`);

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
    * A PUT to the negotiations endpoint is interpreted as a request for alteration in an existing operation managed by the receiving USS.  The requesting USS supplies a GUFI that references the operation that may be altered if the request is granted by the receiving USS.
For validation purposes:
  {message_id} in path == NegotiationMessage.message_id in body data
    * @method
    * @name uss_api#putNegotiationsByMessageId
         * @param {string} messageId - PUT by message_id
         * @param {} negotiationMessage - The NegotiationMessage data
    */
    putNegotiationsByMessageId(parameters: {
        'messageId': string,
        'negotiationMessage': NegotiationMessage,
    } & CommonRequestOptions): Promise < ResponseWithBody < 204, void > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 409, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/negotiations/{message_id}';
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

            path = path.replace('{message_id}', `${encodeURIComponent(parameters['messageId'].toString())}`);

            if (parameters['messageId'] === undefined) {
                reject(new Error('Missing required  parameter: messageId'));
                return;
            }

            if (parameters['negotiationMessage'] !== undefined) {
                body = parameters['negotiationMessage'];
            }

            if (parameters['negotiationMessage'] === undefined) {
                reject(new Error('Missing required  parameter: negotiationMessage'));
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

    putPositionsByPositionIdURL(parameters: {
        'positionId': string,
        'position': Position,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/positions/{position_id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{position_id}', `${encodeURIComponent(parameters['positionId'].toString())}`);

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
    * Providing position reports to others may allow other USSs to anticipate events.  The USS managing the operation has created the position ID.
For validation purposes:
  {position_id} in path == Position.enroute_positions_id of body data
    * @method
    * @name uss_api#putPositionsByPositionId
         * @param {string} positionId - PUT by enroute_positions_id
         * @param {} position - This API describes the minimum interface that a USS must implement to  be part of the USS Network.  This API allows for communication of data  between USS Instances and from FIMS to a USS regarding new USS Instances.
    */
    putPositionsByPositionId(parameters: {
        'positionId': string,
        'position': Position,
    } & CommonRequestOptions): Promise < ResponseWithBody < 204, void > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/positions/{position_id}';
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

            path = path.replace('{position_id}', `${encodeURIComponent(parameters['positionId'].toString())}`);

            if (parameters['positionId'] === undefined) {
                reject(new Error('Missing required  parameter: positionId'));
                return;
            }

            if (parameters['position'] !== undefined) {
                body = parameters['position'];
            }

            if (parameters['position'] === undefined) {
                reject(new Error('Missing required  parameter: position'));
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

    getOperationsURL(parameters: {
        'registrationId' ? : Array < string >
            ,
        'submitTime' ? : string,
        'state' ? : Array < "ACCEPTED" | "ACTIVATED" | "CLOSED" | "NONCONFORMING" | "ROGUE" >
            ,
        'distance' ? : number,
        'referencePoint' ? : string,
        'sort' ? : Array < "submit_time" | "gufi" | "state" >
            ,
        'sortIncreasing' ? : boolean,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/operations';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters['registrationId'] !== undefined) {
            queryParameters['registration_id'] = parameters['registrationId'];
        }

        if (parameters['submitTime'] !== undefined) {
            queryParameters['submit_time'] = parameters['submitTime'];
        }

        if (parameters['state'] !== undefined) {
            queryParameters['state'] = parameters['state'];
        }

        if (parameters['distance'] !== undefined) {
            queryParameters['distance'] = parameters['distance'];
        }

        if (parameters['referencePoint'] !== undefined) {
            queryParameters['reference_point'] = parameters['referencePoint'];
        }

        if (parameters['sort'] !== undefined) {
            queryParameters['sort'] = parameters['sort'];
        }

        if (parameters['sortIncreasing'] !== undefined) {
            queryParameters['sort_increasing'] = parameters['sortIncreasing'];
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
     * Allows querying for Operation data. Returns an empty list if the query returns nothing.
     * @method
     * @name uss_api#getOperations
     * @param {array} registrationId - Return only results that match the registration_ids provided.  Only operations that have not completed or have completed within the last 24 hours are required to be returned. If multiple IDs are provided, they must be unique and separated by commas.
     * @param {string} submitTime - A single date-time value that will be used to provide all operations submitted AFTER that time.
     * @param {array} state - Return only operations that are in the states provided.  Comma separated list of states.
     * @param {integer} distance - Distance from reference_point to find operations. Ignored if reference_point is not provided.  Units are feet.  Returns all operations that have any operation_volumes whose 2D horizontal dimensions interesect the 2D circle defined by distance and reference_point.  Default value only has meaning when reference_point parameter is provided.
     * @param {string} referencePoint - A single point used to find all operations within some distance from that point. Returns all operations that have any operation_volumes whose 2D horizontal dimensions interesect the 2D circle defined by distance and reference_point.  When distance is excluded and reference_point is included, uses default value (300ft) for distance. Described as a GeoJSON position.  The value is equivalent to what would be seen in the "coordinates" field for a GeoJSON Point object.  See https://tools.ietf.org/html/rfc7946#section-3.1.1 for further reference.  Example would be reference_point=[-122.056364, 37.414371] (URL safe: reference_point%3D%5B-122.056364%2C%2037.414371%5D). As per GeoJSON spec, this is long-lat format in the WGS84 reference system. MUST NOT include a third coordinate element, strictly 2D.
     * @param {array} sort - Field name(s) to use for sorting records. If multiple fields are provided, the sorting is based on the ordered priorty of that list.  Note that the enum provided designates the required fields that a USS must support. A USS may decide to support additional fields, but how that USS communicates that option is out of scope for this API document.
     * @param {boolean} sortIncreasing - For optional use with the 'sort' parameter. If 'sort' is not provided, then 'sort_increasing' will be ignored. Boolean value.  If multiple fields are provided in the 'sort' parameter, this boolean value will apply to all of them.
     * @param {integer} limit - The maximum number or records to return.
     * @param {integer} offset - The index from which to begin the list of returned records.
     */
    getOperations(parameters: {
        'registrationId' ? : Array < string >
            ,
        'submitTime' ? : string,
        'state' ? : Array < "ACCEPTED" | "ACTIVATED" | "CLOSED" | "NONCONFORMING" | "ROGUE" >
            ,
        'distance' ? : number,
        'referencePoint' ? : string,
        'sort' ? : Array < "submit_time" | "gufi" | "state" >
            ,
        'sortIncreasing' ? : boolean,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_getOperations_200 > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 423, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
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

            if (parameters['registrationId'] !== undefined) {
                queryParameters['registration_id'] = parameters['registrationId'];
            }

            if (parameters['submitTime'] !== undefined) {
                queryParameters['submit_time'] = parameters['submitTime'];
            }

            if (parameters['state'] !== undefined) {
                queryParameters['state'] = parameters['state'];
            }

            if (parameters['distance'] !== undefined) {
                queryParameters['distance'] = parameters['distance'];
            }

            if (parameters['referencePoint'] !== undefined) {
                queryParameters['reference_point'] = parameters['referencePoint'];
            }

            if (parameters['sort'] !== undefined) {
                queryParameters['sort'] = parameters['sort'];
            }

            if (parameters['sortIncreasing'] !== undefined) {
                queryParameters['sort_increasing'] = parameters['sortIncreasing'];
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
     * Retrieve an operation by GUFI.  Returns 404 if gufi is not found.
     * @method
     * @name uss_api#getOperationsByGufi
     * @param {string} gufi - GUFI of the operation being requested.
     */
    getOperationsByGufi(parameters: {
        'gufi': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Operation > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 404, UTMRestResponse > | ResponseWithBody < 423, UTMRestResponse >> {
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
        'gufi': string,
        'operation': Operation,
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
    * Announce an Operation to another USS, either initial Operation or an update to the Operation. The Operation's owner creates the ID.
    * @method
    * @name uss_api#putOperationsByGufi
         * @param {string} gufi - PUT operation by gufi
         * @param {} operation - Operational plan with the following properties:
  1. Contains a valid uss_operation_id.
  2. time_available_end value that is in the future.
  3. For an update to an Operation, date-time fields that are in the past MUST NOT be modified.
  4. On the first announcement of an Operation, submit_time SHOULD be equal to update_time.
  5. submit_time MUST be less than or equal to update_time.
  5. {gufi} path parameter MUST equal Operation.gufi of the body data
  6. Operation.uss_id == access_token.sub
  7. Operation.priority_elements.status MUST NOT be PUBLIC_SAFETY.
  8. Other rules for a USS Operation PUT are satisfied.

    */
    putOperationsByGufi(parameters: {
        'gufi': string,
        'operation': Operation,
    } & CommonRequestOptions): Promise < ResponseWithBody < 204, void > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 409, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
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

            if (parameters['operation'] !== undefined) {
                body = parameters['operation'];
            }

            if (parameters['operation'] === undefined) {
                reject(new Error('Missing required  parameter: operation'));
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

    getEnhancedOperationsByGufiURL(parameters: {
        'gufi': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/enhanced/operations/{gufi}';
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
    * Retrieve an operation by GUFI.  Returns 404 if gufi is not found. Similar to '/operations/{gufi}' except all data tagged x-utm-data-accessibility <= SAFETY is returned.
Note that there is currently no GET on '/enhanced/operations/' without specifying a GUFI.  If general seraching for operations is required, then a GET on '/operations' may be performed, followed by individual GETs to this endpoint for enhanced data access.
    * @method
    * @name uss_api#getEnhancedOperationsByGufi
         * @param {string} gufi - GUFI of the operation being requested.
    */
    getEnhancedOperationsByGufi(parameters: {
        'gufi': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Operation > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 404, UTMRestResponse > | ResponseWithBody < 423, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/enhanced/operations/{gufi}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';

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

    putEnhancedOperationsByGufiURL(parameters: {
        'gufi': string,
        'operation': Operation,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/enhanced/operations/{gufi}';
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
    * Announce an Operation to another USS, either initial Operation or an update to the Operation. The Operation's owner creates the ID.
This is the ENHANCED version of the nominal /operations/{gufi} endpoint. A USS receiving an operation on this endpoint MUST validate that PriorityElements.status == PUBLIC_SAFETY with an appropriate severity.
In the future there may be several use cases for the this endpoint. Currently a single use case is required to be supported by USSs.
## Writing a public safety operation
Public safety operations can only be operated by authorized agencies.  The identitiy management of those agencies and individuals within them will have more requirements than are levied on nominal USSs.  Thus the ability to manage those operations is limited to USSs that undergo additional checkout processes.  Successful completion of those processes allows for a USS to earn an additional Role (USS_PUBLIC_SAFETY) within UTM managing public safety ops.
This role provides access to additional scopes, including utm.nasa.gov_write.publicsafety which is required to write to this endpoint.
A public safety operation that ceases to be a public safety operation should CLOSE the operation as announced on this endpoint after creating a non-public safety operation on the nominal endpoint.  Note this means that the operation would be already be in the air when becoming a "new" nominal operation.  In addition, there will be a period of time during which this operation will have 2 GUFIs and 2 plans. The USS should aid the operator in minimizing this period of time (ideally to less than, say, 10 seconds).  This approach ensures that all operations announced on this PUT endpoint have the same PriorityElement requirements.
A nominal operation that becomes a public safety operation should follow a similar procedure as above.  CLOSE the nominal operation after announcing a new public safety operation on this endpoint.
    * @method
    * @name uss_api#putEnhancedOperationsByGufi
         * @param {string} gufi - PUT operation by gufi
         * @param {} operation - Operational plan with the following properties:
  1. All requirements for the non-enhanced PUT Operation endpoint, as stated in this spec.
  2. Operation.priority_elements.status == PUBLIC_SAFETY and its corresponding severity.

    */
    putEnhancedOperationsByGufi(parameters: {
        'gufi': string,
        'operation': Operation,
    } & CommonRequestOptions): Promise < ResponseWithBody < 204, void > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, UTMRestResponse > | ResponseWithBody < 409, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/enhanced/operations/{gufi}';
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

            if (parameters['operation'] !== undefined) {
                body = parameters['operation'];
            }

            if (parameters['operation'] === undefined) {
                reject(new Error('Missing required  parameter: operation'));
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

}

export default uss_api;