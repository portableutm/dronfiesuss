let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { VehicleDao } from "../../src/daos/VehicleDao";

// import App from "../../src/app";
// const controllers = [];
// const app = new App(controllers, 3000, "test");

import { app, init, initAsync } from "../../src/index";

describe('>>> Vehicle entity <<< ', function () {

    before(async () => {
        await initAsync()
    })

    it("should get all vehicles record", async () => {
        chai.request(app.app)
            .get('/vehicle')
            .set('bypass', 'a')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.gt(5)
            });
    });

    it("should insert a new vehicle", async () => {
        let dao = new VehicleDao()
        let vehicles = await dao.all()
        let vehicleCountPreInsert = vehicles.length
        let vehicleToInsert = {
            "nNumber": "",
            "faaNumber": "faaNumber_81128",
            "vehicleName": "vehicle_name828",
            "manufacturer": "PIXHAWK",
            "model": "model_828",
            "class": "Fixed wing",
            "accessType": "",
            "vehicleTypeId": "",
            "org-uuid": "",
            "registeredBy": "User_1"
        }
        chai.request(app.app)
            .post('/vehicle')
            .set('bypass', 'a')
            .send(vehicleToInsert)
            .end(
                async (err, res) => {
                    // console.log(res.body)
                    res.should.have.status(200);
                    res.body.should.have.property('uvin');
                    let vehicles = await dao.all()
                    vehicles.length.should.be.gt(vehicleCountPreInsert)
                });
    });

    it("should get a vehicle", async () => {
        let dao = new VehicleDao()
        let vehicles = await dao.all()
        let vehicle = vehicles[0]
        chai.request(app.app)
            .get(`/vehicle/${vehicle.uvin}`)
            .set('bypass', 'a')
            .end(
                async (err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('uvin');
                });
    });


});