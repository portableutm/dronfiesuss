import { OperationVolume } from "../entities/OperationVolume"

let geojson : GeoJSON.FeatureCollection = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.16107940673828,
                -34.90268592120046
              ],
              [
                -56.16416931152344,
                -34.90571271703311
              ],
              [
                -56.15850448608398,
                -34.90655738433066
              ],
              [
                -56.15670204162597,
                -34.9045160901548
              ],
              [
                -56.16107940673828,
                -34.90268592120046
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.15927696228027,
                -34.902052391674786
              ],
              [
                -56.15979194641113,
                -34.90557193830544
              ],
              [
                -56.152925491333,
                -34.90367140185956
              ],
              [
                -56.156015396118164,
                -34.90092610489535
              ],
              [
                -56.15927696228027,
                -34.902052391674786
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.16811752319336,
                -34.899095855936
              ],
              [
                -56.17438316345215,
                -34.897476755550905
              ],
              [
                -56.176271438598626,
                -34.90507921085794
              ],
              [
                -56.17017745971679,
                -34.911202899151334
              ],
              [
                -56.16811752319336,
                -34.899095855936
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.16416931152344,
                -34.89775834051922
              ],
              [
                -56.16640090942382,
                -34.9037417928827
              ],
              [
                -56.16090774536133,
                -34.900081379674496
              ],
              [
                -56.16013526916504,
                -34.89712477298305
              ],
              [
                -56.16416931152344,
                -34.89775834051922
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.15592956542969,
                -34.897406359158
              ],
              [
                -56.157474517822266,
                -34.90015177377474
              ],
              [
                -56.15412712097168,
                -34.900081379674496
              ],
              [
                -56.15592956542969,
                -34.897406359158
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.16863250732422,
                -34.906838938165656
              ],
              [
                -56.16674423217773,
                -34.91190674210335
              ],
              [
                -56.158246994018555,
                -34.910147123409054
              ],
              [
                -56.165456771850586,
                -34.90557193830544
              ],
              [
                -56.168546676635735,
                -34.90641660705113
              ],
              [
                -56.16863250732422,
                -34.906838938165656
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.15936279296875,
                -34.907472430764535
              ],
              [
                -56.15893363952637,
                -34.9118363580797
              ],
              [
                -56.15189552307129,
                -34.9091617204668
              ],
              [
                -56.15241050720215,
                -34.90690932647357
              ],
              [
                -56.15936279296875,
                -34.907472430764535
              ]
            ]
          ]
        }
      },
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "type": "Polygon",
          "coordinates": [
            [
              [
                -56.154470443725586,
                -34.90620544067929
              ],
              [
                -56.153097152709954,
                -34.91394785253978
              ],
              [
                -56.14906311035156,
                -34.90803553119376
              ],
              [
                -56.15086555480957,
                -34.90507921085794
              ],
              [
                -56.154470443725586,
                -34.90620544067929
              ]
            ]
          ]
        }
      }
    ]
  }

//   geojson.features.forEach((feature)=>{
//     let polygon : GeoJSON.Polygon = feature.geometry
// })

let polygons = geojson.features.map((feature)=>{
    return feature.geometry
    // let pol : GeoJSON.Polygon = feature.geometry
    // return pol;
})

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}



export let OperationsVolumes : OperationVolume[] = polygons.map((polygon : GeoJSON.Polygon, idx)=>{
    let initDate = randomDate(new Date(2019, 0, 0, 0,0,0,0), new Date(2020, 0, 0, 0,0,0,0))
    let endDate = new Date(initDate)
    endDate.setHours(endDate.getDate() + 1)

    let opVolume : OperationVolume = new OperationVolume()
    opVolume.operation_geography = polygon
    opVolume.effective_time_begin = initDate.toLocaleDateString()
    opVolume.effective_time_end = endDate.toLocaleDateString()
    opVolume.min_altitude = 10
    opVolume.max_altitude = 70
    opVolume.beyond_visual_line_of_sight = true
    return opVolume
})




