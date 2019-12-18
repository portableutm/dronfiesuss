import {getRepository, In, Raw} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Operation} from "../entities/Operation";
import { OperationDao } from "../daos/OperationDaos";

export class OperationController {

    // private operationRepository = getRepository(Operation);
    private dao = new OperationDao()

    async all(request: Request, response: Response, next: NextFunction) {
      let state = request.query.state;
      console.log(`Rest Operation state:${state} ${"laaa"}`)
      return this.dao.all({state:state});
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.dao.one(request.params.guifi);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.dao.save(request.body);
    }

    async getOperationByPoint(request: Request, response: Response, next: NextFunction) {
      return this.dao.getOperationByPoint(request.body)
    }

    private parseQuery(query: Express.Request) {
      
    }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     let userToRemove = await this.userRepository.findOne(request.params.id);
    //     await this.userRepository.remove(userToRemove);
    // }

    // function validateParams(obj){
    //     return true;
    // }

  //   ParametersFromSwagger = {"parameters": [
  //     {
  //       "name": "registration_id",
  //       "in": "query",
  //       "description": "Return only results that match the registration_ids provided.  Only operations that have not completed or have completed within the last 24 hours are required to be returned. If multiple IDs are provided, they must be unique and separated by commas.",
  //       "type": "array",
  //       "minItems": 1,
  //       "maxItems": 5,
  //       "uniqueItems": true,
  //       "items": {
  //         "type": "string",
  //         "format": "uuid",
  //         "minLength": 36,
  //         "maxLength": 36
  //       },
  //       "collectionFormat": "csv"
  //     },
      
  //     {
  //       "name": "submit_time",
  //       "in": "query",
  //       "description": "A single date-time value that will be used to provide all operations submitted AFTER that time.",
  //       "type": "string",
  //       "format": "date-time",
  //       "minLength": 20,
  //       "maxLength": 25,
  //       "required": false
  //     },
      
  //     {
  //       "name": "state",
  //       "in": "query",
  //       "description": "Return only operations that are in the states provided.  Comma separated list of states.",
  //       "type": "array",
  //       "minItems": 1,
  //       "maxItems": 5,
  //       "uniqueItems": true,
  //       "items": {
  //         "type": "string",
  //         "enum": [
  //           "ACCEPTED",
  //           "ACTIVATED",
  //           "CLOSED",
  //           "NONCONFORMING",
  //           "ROGUE"
  //         ]
  //       },
  //       "collectionFormat": "csv",
  //       "required": false
  //     },
  //     {
  //       "name": "distance",
  //       "in": "query",
  //       "description": "Distance from reference_point to find operations. Ignored if reference_point is not provided.  Units are feet.  Returns all operations that have any operation_volumes whose 2D horizontal dimensions interesect the 2D circle defined by distance and reference_point.  Default value only has meaning when reference_point parameter is provided.",
  //       "type": "integer",
  //       "format": "int32",
  //       "maximum": 60762,
  //       "minimum": 1,
  //       "default": 300,
  //       "required": false
  //     },
  //     {
  //       "name": "reference_point",
  //       "in": "query",
  //       "description": "A single point used to find all operations within some distance from that point. Returns all operations that have any operation_volumes whose 2D horizontal dimensions interesect the 2D circle defined by distance and reference_point.  When distance is excluded and reference_point is included, uses default value (300ft) for distance. Described as a GeoJSON position.  The value is equivalent to what would be seen in the \"coordinates\" field for a GeoJSON Point object.  See https://tools.ietf.org/html/rfc7946#section-3.1.1 for further reference.  Example would be reference_point=[-122.056364, 37.414371] (URL safe: reference_point%3D%5B-122.056364%2C%2037.414371%5D). As per GeoJSON spec, this is long-lat format in the WGS84 reference system. MUST NOT include a third coordinate element, strictly 2D.",
  //       "type": "string",
  //       "format": "geojson-position",
  //       "required": false
  //     },
  //     {
  //       "name": "sort",
  //       "in": "query",
  //       "description": "Field name(s) to use for sorting records. If multiple fields are provided, the sorting is based on the ordered priorty of that list.  Note that the enum provided designates the required fields that a USS must support. A USS may decide to support additional fields, but how that USS communicates that option is out of scope for this API document.",
  //       "required": false,
  //       "type": "array",
  //       "items": {
  //         "type": "string",
  //         "enum": [
  //           "submit_time",
  //           "gufi",
  //           "state"
  //         ]
  //       },
  //       "collectionFormat": "csv",
  //       "maxItems": 3,
  //       "minItems": 1,
  //       "default": "submit_time"
  //     },
  //     {
  //       "name": "sort_increasing",
  //       "in": "query",
  //       "description": "For optional use with the 'sort' parameter. If 'sort' is not provided, then 'sort_increasing' will be ignored. Boolean value.  If multiple fields are provided in the 'sort' parameter, this boolean value will apply to all of them.",
  //       "required": false,
  //       "type": "boolean",
  //       "default": true
  //     },
  //     {
  //       "name": "limit",
  //       "in": "query",
  //       "description": "The maximum number or records to return.",
  //       "required": false,
  //       "type": "integer",
  //       "default": 10,
  //       "maximum": 100,
  //       "exclusiveMaximum": false,
  //       "minimum": 1,
  //       "exclusiveMinimum": false,
  //       "format": "int32"
  //     },
  //     {
  //       "name": "offset",
  //       "in": "query",
  //       "description": "The index from which to begin the list of returned records.",
  //       "required": false,
  //       "type": "integer",
  //       "default": 0,
  //       "minimum": 0,
  //       "exclusiveMinimum": false,
  //       "format": "int32"
  //     }
  //   ]
  // }
  // async allWithParameters(request: Request, response: Response, next: NextFunction) {
  //     // registration_id array de strings en uuid
  //     // submit_time string date
  //     // state array de enum
  //     // distance int
  //     // reference_point geojson
  //     // sort array enum
  //     // sort_increasing bool
  //     // limit
  //     // offset

  //     // validateParams(request.params);

  //     let registration_id = request.params.registration_id.split(",");
  //     let submit_time = request.params.submit_time;
  //     let state = request.params.state;
  //     let distance = request.params.distance;
  //     let reference_point = request.params.reference_point;
  //     let sort = request.params.sort;
  //     let sort_increasing = request.params.sort_increasing;
  //     let limit = request.params.limit;
  //     let offset = request.params.offset;

  //     return this.operationRepository.find( {
  //         where: {
  //             registration_id: In(registration_id),
  //             submit_time : Raw(alias =>`${alias} > ${submit_time}`)
  //         }

  //       });
  // }

}