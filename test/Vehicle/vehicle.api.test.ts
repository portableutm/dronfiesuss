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

describe.only('>>> Vehicle entity <<< ', function () {

    before(function (done) {
        this.timeout(3000);
        initAsync()
            .then(done)
            .catch(done)
    })

    it("should get all vehicles record", function (done) {
        chai.request(app.app)
            .get('/vehicle')
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.gt(5)
                done();
            })
            .catch(done);
    });

    it("should insert a new vehicle", function (done) {
        let vehicleCountPreInsert = 9 // from data // vehicles.length
        let dao = new VehicleDao()
        // let vehicles = await dao.all()
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
            "registeredBy": "admin"
        }
        chai.request(app.app)
            .post('/vehicle')
            .set('bypass', 'a')
            .send(vehicleToInsert)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('uvin');
                dao.all().then(function(vehicles){
                    vehicles.length.should.be.eq(vehicleCountPreInsert+1)
                    done();
                })
                .catch(done)
            })
            .catch(done);
    });

    it("should get a vehicle", function (done) {
        let uvin = "bd9b2eb6-7ab7-442e-b99c-78890581f198";
        chai.request(app.app)
            .get(`/vehicle/${uvin}`)
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('uvin');
                res.body.should.have.property('vehicleName').equal("vehicle_name9");
                done();
            })
            .catch(done)

    });

    it("GET /vehicle/${cualquierVehiiculo} should not get a vehicle", function (done) {
        let uvin = "bd9c2ea6-7ab7-442e-b99c-78890181c198";
        chai.request(app.app)
            .get(`/vehicle/${uvin}`)
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(404);
                // res.body.should.have.property('uvin');
                // res.body.should.have.property('vehicleName').equal("vehicle_name9");
                done();
            })
            .catch(done)

    });


});