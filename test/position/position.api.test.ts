let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { PositionDao } from "../../src/daos/PositionDao";
import { app, initAsync } from "../../src/index";

import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";

describe('>>> Position entity <<< ', function () {

    before(function (done) {
        this.timeout(3000);
        initAsync()
            .then(done)
            .catch(done)
    })

    it("should get all position record", function (done) {
        chai.request(app.app)
            .get('/position')
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('array')
                // res.body.length.should.be.gt(5)
                done();
            })
            .catch(done);
    });


    //TODO check operation change it status
    it("should insert a new position outside operation", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        let dao = new PositionDao()
        let positionToInsert = {
            "altitude_gps": 30,
            "location": {
                "type": "Point",
                "coordinates": [
                    -56.1636114120483,
                    -34.9068213410793
                ]
            },
            "time_sent": "2019-12-11T19:59:10.000Z",
            "gufi" : "f7891e78-9bb4-431d-94d3-1a506910c254",
            "heading" : 160
        }
        chai.request(app.app)
            .post('/position')
            .set('bypass', 'a')
            .send(positionToInsert)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('id');
                // dao.all().then(function(vehicles){
                //     // vehicles.length.should.be.eq(vehicleCountPreInsert+1)
                //     done();
                // })
                // .catch(done)
                done();
            })
            .catch(done);
    });

    it("should insert a new position in operation", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        let dao = new PositionDao()
        let positionToInsert = {
            "altitude_gps": 30,
            "location": {
                "type": "Point",
                "coordinates": [
                    -56.15389108657837,
          -34.90865141786639
                ]
            },
            "time_sent": "2019-12-11T19:59:10.000Z",
            "gufi" : "f7891e78-9bb4-431d-94d3-1a506910c254",
            "heading" : 160
        }
        chai.request(app.app)
            .post('/position')
            .set('bypass', 'a')
            .send(positionToInsert)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('id');
                // dao.all().then(function(vehicles){
                //     // vehicles.length.should.be.eq(vehicleCountPreInsert+1)
                //     done();
                // })
                // .catch(done)
                done();
            })
            .catch(done);
    });

    it("should not insert a new position because invalid heading", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        let dao = new PositionDao()
        let positionToInsert = {
            "altitude_gps": 30,
            "location": {
                "type": "Point",
                "coordinates": [
                    -56.1636114120483,
                    -34.9068213410793
                ]
            },
            "time_sent": "2019-12-11T19:59:10.000Z",
            "gufi" : "f7891e78-9bb4-431d-94d3-1a506910c254",
            "heading" : 200
        }
        chai.request(app.app)
            .post('/position')
            .set('bypass', 'a')
            .send(positionToInsert)
            .then(function (res) {
                res.should.have.status(400);
                // res.body.should.have.property('id');
                // dao.all().then(function(vehicles){
                //     // vehicles.length.should.be.eq(vehicleCountPreInsert+1)
                //     done();
                // })
                // .catch(done)
                done();
            })
            .catch(done);
    });
    
    

    it("should get a position", function (done) {
        let id = "1";
        chai.request(app.app)
            .get(`/position/${id}`)
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(200);
                // res.body.should.have.property('uvin');
                // res.body.should.have.property('vehicleName').equal("vehicle_name9");
                done();
            })
            .catch(done)
    });

    // it("should not get a vehicle for anonymous user", function (done) {
    //     let uvin = "bd9b2eb6-7ab7-442e-b99c-78890581f198";
    //     chai.request(app.app)
    //         .get(`/vehicle/${uvin}`)
    //         // .set('bypass', 'a')
    //         .then(function (res) {
    //             res.should.have.status(401);
    //             // res.body.should.have.property('uvin');
    //             // res.body.should.have.property('vehicleName').equal("vehicle_name9");
    //             done();
    //         })
    //         .catch(done)
    // });

    // it("GET /vehicle/${cualquierVehiiculo} should not get a vehicle", function (done) {
    //     let uvin = "bd9c2ea6-7ab7-442e-b99c-78890181c198";
    //     chai.request(app.app)
    //         .get(`/vehicle/${uvin}`)
    //         .set('bypass', 'a')
    //         .then(function (res) {
    //             res.should.have.status(404);
    //             // res.body.should.have.property('uvin');
    //             // res.body.should.have.property('vehicleName').equal("vehicle_name9");
    //             done();
    //         })
    //         .catch(done)

    // });


});