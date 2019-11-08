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

export type OrgData = {
    'orgName' ? : string;
    'POC' ? : {
        'name' ? : string;
        'tel' ? : string;
        'email' ? : string;
    } & {
        [key: string]: any;
    };
} & {
    [key: string]: any;
};

export type VehiclePost = {
    'uvin' ? : string;
    'vehicleTypeId' ? : string;
    'createdTS' ? : string;
    'nNumber' ? : string;
    'faaNumber' ? : string;
    'vehicleName' ? : string;
} & {
    [key: string]: any;
};

export type VehicleReg = {
    'uvin' ? : string;
    'date' ? : string;
    'registeredBy' ? : string;
    'nNumber' ? : string;
    'faaNumber' ? : string;
    'vehicleName' ? : string;
    'manufacturer' ? : string;
    'model' ? : string;
    'class' ? : string;
    'accessType' ? : string;
    'vehicleTypeId' ? : string;
    'org-uuid' ? : string;
} & {
    [key: string]: any;
};

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
 * Validates that the vehicle ID was properly registered for a NASA event.
 * @class vehicle
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export class vehicle {

    private domain: string = "https://utmregistry.arc.nasa.gov/api";
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

    getUvinsByUvinURL(parameters: {
        'uvin': string,
        'accept': string,
        'orgCode' ? : string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uvins/{uvin}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{uvin}', `${encodeURIComponent(parameters['uvin'].toString())}`);

        if (parameters['orgCode'] !== undefined) {
            queryParameters['org-code'] = parameters['orgCode'];
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
    * Returns information on vehicle with the given uvin. If it is a valid request and the uvin exists in the database, a VehicleReg model object is returned with an 200 HTTP code.  If it is a valid request and the uvin does not exist in the database, an empty array is returned also with a  200 HTTP code.

    * @method
    * @name vehicle#getUvinsByUvin
         * @param {string} uvin - Specifies the vehicle id
         * @param {string} accept - Must be 'application/json'
         * @param {string} orgCode - Organization authenticity code.
    */
    getUvinsByUvin(parameters: {
        'uvin': string,
        'accept': string,
        'orgCode' ? : string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, VehicleReg > | ResponseWithBody < 400, void > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 403, void > | ResponseWithBody < 404, void > | ResponseWithBody < 503, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uvins/{uvin}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {

            path = path.replace('{uvin}', `${encodeURIComponent(parameters['uvin'].toString())}`);

            if (parameters['uvin'] === undefined) {
                reject(new Error('Missing required  parameter: uvin'));
                return;
            }

            if (parameters['accept'] !== undefined) {
                headers['Accept'] = parameters['accept'];
            }

            if (parameters['accept'] === undefined) {
                reject(new Error('Missing required  parameter: accept'));
                return;
            }

            if (parameters['orgCode'] !== undefined) {
                queryParameters['org-code'] = parameters['orgCode'];
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

    postUvinsURL(parameters: {
        'accept': string,
        'vehicleTypeId': string,
        'orgUuid': string,
        'orgCode': string,
        'vehicleName': string,
        'eventId': number,
        'nNumber' ? : string,
        'faaNumber' ? : string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uvins/';
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
     * USS registers a vehicele on behalf of a vehicle owner
     * @method
     * @name vehicle#postUvins
     * @param {string} accept - Must be 'application/json'
     * @param {string} vehicleTypeId - Vehicle type id of vehicle to be registered
     * @param {string} orgUuid - Organization uuid
     * @param {string} orgCode - Organization authenticity code.
     * @param {string} vehicleName - Name of vehicle instance
     * @param {number} eventId - Event identifier; Enter X for TCLX
     * @param {string} nNumber - N-number of aircraft
     * @param {string} faaNumber - FAA number of aircraft
     */
    postUvins(parameters: {
        'accept': string,
        'vehicleTypeId': string,
        'orgUuid': string,
        'orgCode': string,
        'vehicleName': string,
        'eventId': number,
        'nNumber' ? : string,
        'faaNumber' ? : string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 201, VehiclePost >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uvins/';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';
            headers['Content-Type'] = 'application/x-www-form-urlencoded';

            if (parameters['accept'] !== undefined) {
                headers['Accept'] = parameters['accept'];
            }

            if (parameters['accept'] === undefined) {
                reject(new Error('Missing required  parameter: accept'));
                return;
            }

            if (parameters['vehicleTypeId'] !== undefined) {
                form['vehicle-type-id'] = parameters['vehicleTypeId'];
            }

            if (parameters['vehicleTypeId'] === undefined) {
                reject(new Error('Missing required  parameter: vehicleTypeId'));
                return;
            }

            if (parameters['orgUuid'] !== undefined) {
                form['org-uuid'] = parameters['orgUuid'];
            }

            if (parameters['orgUuid'] === undefined) {
                reject(new Error('Missing required  parameter: orgUuid'));
                return;
            }

            if (parameters['orgCode'] !== undefined) {
                form['org-code'] = parameters['orgCode'];
            }

            if (parameters['orgCode'] === undefined) {
                reject(new Error('Missing required  parameter: orgCode'));
                return;
            }

            if (parameters['vehicleName'] !== undefined) {
                form['vehicle-name'] = parameters['vehicleName'];
            }

            if (parameters['vehicleName'] === undefined) {
                reject(new Error('Missing required  parameter: vehicleName'));
                return;
            }

            if (parameters['eventId'] !== undefined) {
                form['event-id'] = parameters['eventId'];
            }

            if (parameters['eventId'] === undefined) {
                reject(new Error('Missing required  parameter: eventId'));
                return;
            }

            if (parameters['nNumber'] !== undefined) {
                form['n-number'] = parameters['nNumber'];
            }

            if (parameters['faaNumber'] !== undefined) {
                form['faa-number'] = parameters['faaNumber'];
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

    getOrgsByUvinURL(parameters: {
        'uvin': string,
        'accept': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/orgs/{uvin}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{uvin}', `${encodeURIComponent(parameters['uvin'].toString())}`);

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
    * Returns information on vehicle owner, for example, a Public Safety
  USS gets vehicle owner's contact data.

    * @method
    * @name vehicle#getOrgsByUvin
         * @param {string} uvin - Specifies the vehicle id
         * @param {string} accept - Must be 'application/json'
    */
    getOrgsByUvin(parameters: {
        'uvin': string,
        'accept': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, OrgData >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/orgs/{uvin}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {

            path = path.replace('{uvin}', `${encodeURIComponent(parameters['uvin'].toString())}`);

            if (parameters['uvin'] === undefined) {
                reject(new Error('Missing required  parameter: uvin'));
                return;
            }

            if (parameters['accept'] !== undefined) {
                headers['Accept'] = parameters['accept'];
            }

            if (parameters['accept'] === undefined) {
                reject(new Error('Missing required  parameter: accept'));
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

}

export default vehicle;