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

export type Response_getUss_200 = Array < UssInstance >
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
 * This API describes the RESTful interface to the USS discovery service within the UTM System.  This service allows for authenticated USS operators to submit information about their USS and for all stakeholders to query for a USS Instances matching certain parameters.
 * @class uss_discovery_api
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export class uss_discovery_api {

    private domain: string = "https://utm.defined.url/ussdisc";
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

    getUssURL(parameters: {
        'fields' ? : Array < string >
            ,
        'ussName' ? : string,
        'before' ? : string,
        'after' ? : string,
        'containsPoint' ? : Array < number >
            ,
        'containsBbox' ? : Array < number >
            ,
        'intersectsBbox' ? : Array < number >
            ,
        'referencePoint' ? : Array < number >
            ,
        'distance' ? : number,
        'sort' ? : string,
        'sortIncreasing' ? : boolean,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uss';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        if (parameters['fields'] !== undefined) {
            queryParameters['fields'] = parameters['fields'];
        }

        if (parameters['ussName'] !== undefined) {
            queryParameters['uss_name'] = parameters['ussName'];
        }

        if (parameters['before'] !== undefined) {
            queryParameters['before'] = parameters['before'];
        }

        if (parameters['after'] !== undefined) {
            queryParameters['after'] = parameters['after'];
        }

        if (parameters['containsPoint'] !== undefined) {
            queryParameters['contains_point'] = parameters['containsPoint'];
        }

        if (parameters['containsBbox'] !== undefined) {
            queryParameters['contains_bbox'] = parameters['containsBbox'];
        }

        if (parameters['intersectsBbox'] !== undefined) {
            queryParameters['intersects_bbox'] = parameters['intersectsBbox'];
        }

        if (parameters['referencePoint'] !== undefined) {
            queryParameters['reference_point'] = parameters['referencePoint'];
        }

        if (parameters['distance'] !== undefined) {
            queryParameters['distance'] = parameters['distance'];
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
    * Allows for querying for USS instances.
    * @method
    * @name uss_discovery_api#getUss
         * @param {array} fields - The specific subset of fields to return. Comma separated list. (If list is empty, no fields are returned.)  Default will be all fields (i.e. when fields parameter is not included in the query). 
         * @param {string} ussName - Returns uss_instances with a particular uss_name.
         * @param {string} before - Returns uss_instances active during and before the given time i.e., time_available_begin < before. Example: 2017-08-20T14:11:56.118Z
         * @param {string} after - Returns uss_instances active during and after the given time i.e., time_available_end > before. Example:2017-08-20T14:11:56.118Z
         * @param {array} containsPoint - Returns uss_instances containing the given Point. The coordinates are comma delimited. Example: -121.2204,36.6684
         * @param {array} containsBbox - Returns uss_instances containing the given Bbox. The coordinates are comma delimited (lon_min,lat_min,lon_max,lat_max). Example: -121.3193,36.6089,-121.2204,36.6684
         * @param {array} intersectsBbox - Returns uss_instances intersecting the given Bbox. The coordinates are comma delimited (lon_min,lat_min,lon_max,lat_max). Example: -121.1133,36.5317,-121.0941,36.6530
         * @param {array} referencePoint - Returns uss_instances around the given point within the 'distance'. It requires parameter 'distance' to be provided.
Described as a GeoJSON position.  The value is equivalent to what would be seen in the "coordinates" field for a GeoJSON Point object.  See https://tools.ietf.org/html/rfc7946#section-3.1.1 for further reference.  Example would be reference_point=[-122.056364, 37.414371] (URL safe: reference_point%3D%5B-122.056364%2C%2037.414371%5D). As per GeoJSON spec, this is long-lat format in the WGS84 reference system.
MUST NOT include a third coordinate element, strictly 2D.
         * @param {number} distance - Distance (in feet) around the 'reference_point'. It requires parameter 'reference_point' to be provided.
         * @param {string} sort - A valid field name to use for sorting records. If multiple fields are provided, the sorting is based on the ordered priorty of that list.
         * @param {boolean} sortIncreasing - For optional use with the 'sort' parameter. If 'sort' is not provided, then 'sort_increasing' will be ignored. Boolean value.  If multiple fields are provided in the 'sort' paramenter, this boolean value will apply to all of them.
         * @param {integer} limit - The maximum number or records to return. Default 1000.
Please note that if there are more than 1000 instances, the caller might not know there are more.  It is recommended to call again with offset = 1000, if your first call returns exactly 1000 records.
Also note if we are returning 1000 records, there is probably something very wrong with overall design.  Limit added now for testing purposes as concept is further developed.
         * @param {integer} offset - The index from which to begin the list of returned records. Default 0.
    */
    getUss(parameters: {
        'fields' ? : Array < string >
            ,
        'ussName' ? : string,
        'before' ? : string,
        'after' ? : string,
        'containsPoint' ? : Array < number >
            ,
        'containsBbox' ? : Array < number >
            ,
        'intersectsBbox' ? : Array < number >
            ,
        'referencePoint' ? : Array < number >
            ,
        'distance' ? : number,
        'sort' ? : string,
        'sortIncreasing' ? : boolean,
        'limit' ? : number,
        'offset' ? : number,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, Response_getUss_200 > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uss';
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

            if (parameters['fields'] !== undefined) {
                queryParameters['fields'] = parameters['fields'];
            }

            if (parameters['ussName'] !== undefined) {
                queryParameters['uss_name'] = parameters['ussName'];
            }

            if (parameters['before'] !== undefined) {
                queryParameters['before'] = parameters['before'];
            }

            if (parameters['after'] !== undefined) {
                queryParameters['after'] = parameters['after'];
            }

            if (parameters['containsPoint'] !== undefined) {
                queryParameters['contains_point'] = parameters['containsPoint'];
            }

            if (parameters['containsBbox'] !== undefined) {
                queryParameters['contains_bbox'] = parameters['containsBbox'];
            }

            if (parameters['intersectsBbox'] !== undefined) {
                queryParameters['intersects_bbox'] = parameters['intersectsBbox'];
            }

            if (parameters['referencePoint'] !== undefined) {
                queryParameters['reference_point'] = parameters['referencePoint'];
            }

            if (parameters['distance'] !== undefined) {
                queryParameters['distance'] = parameters['distance'];
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

    getUssByIdURL(parameters: {
        'id': string,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uss/{id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{id}', `${encodeURIComponent(parameters['id'].toString())}`);

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
     * Allows for querying for USS Instances.
     * @method
     * @name uss_discovery_api#getUssById
     * @param {string} id - id
     */
    getUssById(parameters: {
        'id': string,
    } & CommonRequestOptions): Promise < ResponseWithBody < 200, UssInstance > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 429, void >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uss/{id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        let body: any;
        let queryParameters: QueryParameters = {};
        let headers: RequestHeaders = {};
        let form: any = {};
        return new Promise((resolve, reject) => {
            headers['Accept'] = 'application/json';

            path = path.replace('{id}', `${encodeURIComponent(parameters['id'].toString())}`);

            if (parameters['id'] === undefined) {
                reject(new Error('Missing required  parameter: id'));
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

    putUssByIdURL(parameters: {
        'id': string,
        'ussInstance': UssInstance,
    } & CommonRequestOptions): string {
        let queryParameters: QueryParameters = {};
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uss/{id}';
        if (parameters.$path) {
            path = (typeof(parameters.$path) === 'function') ? parameters.$path(path) : parameters.$path;
        }

        path = path.replace('{id}', `${encodeURIComponent(parameters['id'].toString())}`);

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
    * Allows for USS operators to submit a new USS Instance or update a previous USS Instance submission.
    * @method
    * @name uss_discovery_api#putUssById
         * @param {string} id - id
         * @param {} ussInstance - USS Instance with the following properties:
  1. Contains a valid uss_instance_id.
  2. Instance has time_available_end value that is in the future.
  3. No date-time fields that are in the past are modified.
  4. Other rules for a USS Instance POST are satisfied.

    */
    putUssById(parameters: {
        'id': string,
        'ussInstance': UssInstance,
    } & CommonRequestOptions): Promise < ResponseWithBody < 204, void > | ResponseWithBody < 400, UTMRestResponse > | ResponseWithBody < 401, UTMRestResponse > | ResponseWithBody < 429, UTMRestResponse >> {
        const domain = parameters.$domain ? parameters.$domain : this.domain;
        let path = '/uss/{id}';
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

            path = path.replace('{id}', `${encodeURIComponent(parameters['id'].toString())}`);

            if (parameters['id'] === undefined) {
                reject(new Error('Missing required  parameter: id'));
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

}

export default uss_discovery_api;