let chai = require('chai');
let chaiHttp = require('chai-http');

chai.use(chaiHttp);
chai.should();

import { OperationDao } from "../../src/daos/OperationDaos";
import { Point, Polygon } from "geojson";
import { OperationVolume } from "../../src/entities/OperationVolume";

let opDao : OperationDao;

import { app, init, initAsync } from "../../src/index";



describe(' >>> Operation spatial querys <<< ', function () {
  before(async () => {
    await initAsync();
    opDao = new OperationDao()

  })

  it("Get the operation on point [-56.15835428237914,-34.91030549063592]", async () => {
    const origin: Point = {
      type: "Point",
      coordinates: [-56.15835428237914, -34.91030549063592]
    };
    let ops = await opDao.getOperationByPoint(origin)
    ops.should.have.lengthOf(1)
  });

  it("Does't get operation on [-56.15835428237914,-34.91030549063592]", async () => {
    const origin: Point = {
      type: "Point",
      coordinates: [-56.15436315536499, -34.90761320623389]
    };
    let opDao = new OperationDao()
    let ops = await opDao.getOperationByPoint(origin)
    ops.should.have.lengthOf(0)
  });

  it("Get all operations", async () => {
    let opDao = new OperationDao()
    let operations = await opDao.all()
    operations.should.not.empty
  })

  it("get a operation when getOperationByVolume by volume intersection", async () => {
    let operation_volume = new OperationVolume()
    operation_volume.effective_time_begin = "2019-12-11T21:59:10Z"
    operation_volume.effective_time_end = "2019-12-11T22:59:10Z"
    operation_volume.min_altitude = 90
    operation_volume.max_altitude = 100
    const polygon: Polygon = {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -56.16494178771972,
            -34.905184795559876
          ],
          [
            -56.16168022155762,
            -34.9083170799602
          ],
          [
            -56.15906238555908,
            -34.906135051768
          ],
          [
            -56.16198062896728,
            -34.90444569979538
          ],
          [
            -56.16494178771972,
            -34.905184795559876
          ]
        ]
      ]
    };
    operation_volume.operation_geography = polygon
    operation_volume.beyond_visual_line_of_sight = true
    console.log(JSON.stringify(operation_volume))
    let opDao = new OperationDao()
    let ops = await opDao.getOperationByVolume(operation_volume)
    ops.should.have.lengthOf(1)
  });

  it("doesn't get a operation when getOperationByVolume because no operation intersection", async () => {
    let operation_volume = new OperationVolume()
    operation_volume.effective_time_begin = "2019-12-11T21:59:10Z"
    operation_volume.effective_time_end = "2019-12-11T22:59:10Z"
    operation_volume.min_altitude = 90
    operation_volume.max_altitude = 100
    const polygon: Polygon = {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -56.1566162109375,
            -34.90567752237382
          ],
          [
            -56.15899801254272,
            -34.9075076246545
          ],
          [
            -56.153719425201416,
            -34.908704207937646
          ],
          [
            -56.15395545959473,
            -34.91287451630941
          ],
          [
            -56.154277324676514,
            -34.91468686277003
          ],
          [
            -56.16358995437622,
            -34.91217068165463
          ],
          [
            -56.16264581680298,
            -34.91475724434973
          ],
          [
            -56.15311861038208,
            -34.9151795325607
          ],
          [
            -56.15266799926758,
            -34.90581830092048
          ],
          [
            -56.1566162109375,
            -34.90567752237382
          ]
        ]
      ]
    };
    operation_volume.operation_geography = polygon
    operation_volume.beyond_visual_line_of_sight = true
    let opDao = new OperationDao()
    let ops = await opDao.getOperationByVolume(operation_volume)
    ops.should.have.lengthOf(0)
  });

  it("get a operation when getOperationByVolume by time intersection", async () => {
    let operation_volume = new OperationVolume()
    operation_volume.effective_time_begin = "2019-12-11T16:59:10Z"
    operation_volume.effective_time_end = "2019-12-11T22:59:10Z"
    operation_volume.min_altitude = 90
    operation_volume.max_altitude = 100
    const polygon: Polygon = {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -56.1566162109375,
            -34.90567752237382
          ],
          [
            -56.15899801254272,
            -34.9075076246545
          ],
          [
            -56.153719425201416,
            -34.908704207937646
          ],
          [
            -56.15395545959473,
            -34.91287451630941
          ],
          [
            -56.154277324676514,
            -34.91468686277003
          ],
          [
            -56.16358995437622,
            -34.91217068165463
          ],
          [
            -56.16264581680298,
            -34.91475724434973
          ],
          [
            -56.15311861038208,
            -34.9151795325607
          ],
          [
            -56.15266799926758,
            -34.90581830092048
          ],
          [
            -56.1566162109375,
            -34.90567752237382
          ]
        ]
      ]
    };
    operation_volume.operation_geography = polygon
    operation_volume.beyond_visual_line_of_sight = true
    let opDao = new OperationDao()
    let ops = await opDao.getOperationByVolume(operation_volume)
    ops.should.have.lengthOf(1)
  });

  it("get a operation when getOperationByVolume by altitude intersection", async () => {
    let operation_volume = new OperationVolume()
    operation_volume.effective_time_begin = "2019-12-11T21:59:10Z"
    operation_volume.effective_time_end = "2019-12-11T22:59:10Z"
    operation_volume.min_altitude = 30
    operation_volume.max_altitude = 100
    const polygon: Polygon = {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -56.1566162109375,
            -34.90567752237382
          ],
          [
            -56.15899801254272,
            -34.9075076246545
          ],
          [
            -56.153719425201416,
            -34.908704207937646
          ],
          [
            -56.15395545959473,
            -34.91287451630941
          ],
          [
            -56.154277324676514,
            -34.91468686277003
          ],
          [
            -56.16358995437622,
            -34.91217068165463
          ],
          [
            -56.16264581680298,
            -34.91475724434973
          ],
          [
            -56.15311861038208,
            -34.9151795325607
          ],
          [
            -56.15266799926758,
            -34.90581830092048
          ],
          [
            -56.1566162109375,
            -34.90567752237382
          ]
        ]
      ]
    };
    operation_volume.operation_geography = polygon
    operation_volume.beyond_visual_line_of_sight = true
    let opDao = new OperationDao()
    let ops = await opDao.getOperationByVolume(operation_volume)
    ops.should.have.lengthOf(1)
  });

})