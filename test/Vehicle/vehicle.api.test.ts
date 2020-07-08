let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { VehicleDao } from "../../src/daos/VehicleDao";

import { app, initAsync } from "../../src/index";
import { TEST_TIMEOUT } from "../conf"; 
import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";

describe('>>> Vehicle entity <<< ', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function(application){
                done()
            }))
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

    it("should get all the MaurineFowlie vehicles", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        chai.request(app.app)
            .get('/vehicle')
            .set('auth', token)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.eq(5)
                res.body.forEach(v => {
                    v.registeredBy.username.should.eq("MaurineFowlie")
                });
                done();
            })
            .catch(done);
    });

    it("POST /vehicle should insert a new vehicle", function (done) {
        let username = 'MaurineFowlie'
        let token = getToken('maurine@dronfies.com',  username, Role.PILOT)

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
            "registeredBy": "",
            "owner_id" : username
        }
        chai.request(app.app)
            .post('/vehicle')
            .set('auth', token)
            .send(vehicleToInsert)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('uvin');
                let uvin = res.body.uvin
                dao.all()
                .then(function(vehicles){
                    vehicles.length.should.be.eq(vehicleCountPreInsert+1)
                    dao.one(uvin)
                    .then(function(vehicle){
                        vehicle.registeredBy.username.should.eq(username)
                        done();
                    }).catch(done)
                }).catch(done)
            })
            .catch(done);
    });

    it("POST /vehicle should not insert a new vehicle because the owner does not exist", function (done) {
        let username = 'MaurineFowlie'
        let token = getToken('maurine@dronfies.com',  username, Role.PILOT)

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
            "registeredBy": "",
            "owner_id" : "croc!" //username
        }
        chai.request(app.app)
            .post('/vehicle')
            .set('auth', token)
            .send(vehicleToInsert)
            .then(function (res) {
                res.should.have.status(400);
                done(); 
            })
            .catch(done);
    });
    

    it("should get a vehicle", function (done) {
        let uvin = "1e8a387d-07ad-41b0-a908-01d2d59ac8d5";
        chai.request(app.app)
            .get(`/vehicle/${uvin}`)
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('uvin');
                res.body.should.have.property('vehicleName').equal("vehicle_name2");
                done();
            })
            .catch(done)
    });

    it("should not get a vehicle for anonymous user", function (done) {
        let uvin = "bd9b2eb6-7ab7-442e-b99c-78890581f198";
        chai.request(app.app)
            .get(`/vehicle/${uvin}`)
            // .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(401);
                // res.body.should.have.property('uvin');
                // res.body.should.have.property('vehicleName').equal("vehicle_name9");
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

    it("GET /vehicle/188d89d8-fb4f-40be-a5ee-059feca02cca should get a MaurineFowlie's vehicle with MaurineFowlie user", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        let uvin = "188d89d8-fb4f-40be-a5ee-059feca02cca";
        
        chai.request(app.app)
            .get(`/vehicle/${uvin}`)
            .set('auth', token)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('object')
                res.body.registeredBy.username.should.eq("MaurineFowlie")
                done();
            })
            .catch(done);
    });

    it("GET /vehicle/1e8a387d-07ad-41b0-a908-01d2d59ac8d5 should not get an other user vehicle with MaurineFowlie user", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        let uvin = "1e8a387d-07ad-41b0-a908-01d2d59ac8d5";
        
        chai.request(app.app)
            .get(`/vehicle/${uvin}`)
            .set('auth', token)
            .then(function (res) {
                res.should.have.status(404);
                // res.body.should.be.a('object')
                // res.body.registeredBy.username.should.eq("MaurineFowlie")
                done();
            })
            .catch(done);
    });



});