let {
    features
} = require('./curvaSobreOperation')
const https = require('http')

let baseDate = new Date()
let  effective_time_begin = new Date(baseDate)
effective_time_begin.setMinutes(baseDate.getMinutes() + 2)
let  effective_time_end = new Date(baseDate)
effective_time_end.setHours(baseDate.getHours() + 2)

let operation = {
    "pilot_name": "Lenemy",
    "aircraft_comments": "Es un phnatom",
    "flight_comments": "Prueba timer - script",
    "volumes_description": "v0.1 - Restricted to one volume.",
    "flight_number": "12345678",
    "submit_time": "2020-02-18T18:05:54.876Z",
    "update_time": "2020-02-18T18:05:48.175Z",
    "faa_rule": 0,
    "operation_volumes": [
      {
        "near_structure": false,
        "effective_time_begin":  effective_time_begin.toISOString(), //"2020-02-18T18:05:16.809Z",
        "effective_time_end": effective_time_end.toISOString(),
        "min_altitude": "-1",
        "max_altitude": 393,
        "beyond_visual_line_of_sight": false,
        "operation_geography":{
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.159834861755364,
                -34.91795954238727
              ],
              [
                -56.16240978240967,
                -34.92221734956747
              ],
              [
                -56.15567207336426,
                -34.922569224576016
              ],
              [
                -56.15395545959473,
                -34.920141256305946
              ],
              [
                -56.159834861755364,
                -34.91795954238727
              ]
            ]
          ]
        }
      }
    ],
    "priority_elements": {
      "priority_level": 1,
      "priority_status": "EMERGENCY_AIR_AND_GROUND_IMPACT"
    },
    "uas_registrations": [],
    "contingency_plans": [
      {
        "contingency_cause": [
          "ENVIRONMENTAL",
          "LOST_NAV"
        ],
        "contingency_location_description": "OPERATOR_UPDATED",
        "contingency_polygon": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.159834861755364,
                -34.91795954238727
              ],
              [
                -56.16240978240967,
                -34.92221734956747
              ],
              [
                -56.15567207336426,
                -34.922569224576016
              ],
              [
                -56.15395545959473,
                -34.920141256305946
              ],
              [
                -56.159834861755364,
                -34.91795954238727
              ]
            ]
          ]
        },
        "contingency_response": "LANDING",
        "free_text": "Texto libre DE prueba",
        "loiter_altitude": 30,
        "relative_preference": 30,
        "relevant_operation_volumes": [
          1,
          0
        ],
        "valid_time_begin": "2019-12-11T19:59:10Z",
        "valid_time_end": "2019-12-11T20:59:10Z"
      }
    ],
    "negotiation_agreements": [
      {
        "free_text": "Esto es solo una prueba PRUEBAAAA",
        "discovery_reference": "discovery reference",
        "type": "INTERSECTION",
        "uss_name": "dronfies",
        "uss_name_of_originator": "dronfies",
        "uss_name_of_receiver": "dronfies"
      },
      {
        "free_text": "(2) Esto es solo una prueba",
        "discovery_reference": "(2)discovery reference",
        "type": "INTERSECTION",
        "uss_name": "dronfies",
        "uss_name_of_originator": "dronfies",
        "uss_name_of_receiver": "dronfies"
      }
    ]
  }


function sendOperation(operation) {
    const data = JSON.stringify(operation)
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/operation',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': data.length,
            'bypass' : 'a'
        }
    }
    const req = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)
        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })
    req.on('error', (error) => {
        console.error(error)
    })
    req.write(data)
    req.end()
}

sendOperation(operation)