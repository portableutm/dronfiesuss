let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { VehicleDao } from "../../src/daos/VehicleDao";

import { getToken } from "../../src/services/tokenService";
import { Users } from "../../src/data/users_data";

import { app, init, initAsync } from "../../src/index";
import { Role } from "../../src/entities/User";

describe(' >>> Operation test <<< ', function () {

    // this.timeout(3000);
    before(function (done) {
        this.timeout(3000);

        initAsync()
            .then(done)
            .catch(done)
    })

    it("GET /operation Should get all operations", function (done) {
        // it("Should get all users", (done) => {
        chai.request(app.app)
            .get('/operation')
            .set('bypass', 'a')
            .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .then(function (res) {
                res.should.have.status(200);
                res.body.ops.length.should.be.eq(4)
                done();
            })
            .catch(done)

    });


    it("Should not get all operations if user role is not ADMIN", function (done) {
        // let user = Users[2]
        // let token = getToken(user.email, user.username, user.role)
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)

        chai.request(app.app)
            .get('/operation')
            // .set('bypass', 'a')
            .set('auth', token)
            .set('Accept', 'application/json')
            .then(function (res) {
                res.should.have.status(401);
                // res.body.length.should.be.eq(4)
                done();
            })
            .catch(done)

    });

    it("Should get 2 operations by creator MaurineFowlie", function (done) {
        // let user = Users[2]
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        // let token = getToken(user.email, user.username, user.role)
        chai.request(app.app)
            .get('/operation/creator')
            // .set('bypass', 'a')
            .set('auth', token)
            .set('Accept', 'application/json')
            // .expect('Content-Type', /json/)
            .then(function (res) {
                res.should.have.status(200);
                res.body.ops.length.should.be.eq(2)
                done();
            })
            .catch(done)
    });

    it("Should get 0 operations by creator TrulaRemon", function (done) {
        let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
        chai.request(app.app)
            .get('/operation/creator')
            .set('auth', token)
            .set('Accept', 'application/json')
            .then(function (res) {
                res.should.have.status(200);
                res.body.ops.length.should.be.eq(0)
                done();
            })
            .catch(done)
    });

    it("Should get an operation of MaurineFowlie with MaurineFowlie user", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        let gufi = 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63'
        chai.request(app.app)
            .get(`/operation/${gufi}`)
            .set('auth', token)
            .set('Accept', 'application/json')
            .then(function (res) {
                res.should.have.status(200);
                done();
            })
            .catch(done)
    });

    it("Should not get an operation of MaurineFowlie with TrulaRemon user", function (done) {
        let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
        let gufi = 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63'
        chai.request(app.app)
            .get(`/operation/${gufi}`)
            .set('auth', token)
            .set('Accept', 'application/json')
            .then(function (res) {
                res.should.have.status(404);
                done();
            })
            .catch(done)
    });

    // it("Should create a new operation", function(done){
    //     // it("Should get all users", (done) => {
    //     chai.request(app.app)
    //         .get('/user')
    //         .set('bypass', 'a')
    //         .set('Accept', 'application/json')
    //         .expect('Content-Type', /json/)
    //         .then(function (res) {
    //             res.body.length.should.be.eq(11)
    //         })
    //         .catch(done)
    //         .expect(200, done)
    // });


    // ***************************************
    // ***************************************
    // ***************************************
    // ***************************************
    // ***************************************

    // it("should get 403 when fetch protected resource", (done) => {
    //     chai.request(app.app)
    //         .get('/operation/')
    //         .end((err, res) => {
    //             res.should.have.status(401);
    //             // res.body.should.be.a('array')
    //             done();

    //         });
    // })
    // it("should get token when give correct credentials", (done) => {
    //     chai.request(app.app)
    //         .post('/auth/login')
    //         .send({
    //             "username": "User_1",
    //             "password": "User_1"
    //         })
    //         .end((err, res) => {
    //             console.log(`token::${JSON.stringify(res.text)}, error:${err}`)
    //             res.should.have.status(200);
    //             res.text.should.be.a('string')
    //             done();
    //         });
    // })
    // it("should get error 401 when give incorrect credentials", (done) => {
    //     chai.request(app.app)
    //         .post('/auth/login')
    //         .send({
    //             "username": "User_1",
    //             "password": "User_1_Incorrect"
    //         })
    //         .end((err, res) => {
    //             res.should.have.status(401);
    //             // res.body.should.be.a('array')
    //             // res.body.length.should.be.gt(5)
    //             done();

    //         });
    // })

    // it("should get data from api when use token", (done) => {
    //     chai.request(app.app)
    //         .post('/auth/login')
    //         .send({
    //             "username": "User_1",
    //             "password": "User_1"
    //         })
    //         .end((err, res) => {
    //             console.log(`token::${JSON.stringify(res.text)}, error:${err}`)
    //             res.should.have.status(200);
    //             res.text.should.be.a('string')
    //             let token = res.text
    //             chai.request(app.app)
    //                 .get('/vehicle/')
    //                 .set('auth', token)
    //                 .end((err, res) => {
    //                     res.should.have.status(200);
    //                     // res.body.should.be.a('array')
    //                     done();

    //                 });
    //             // done();
    //         });
    // })

    // it("should get all vehicles record", (done) => {
    //     // app.printStatus()
    //     chai.request(app.app)
    //         .get('/vehicle')
    //         .end((err, res) => {
    //             // console.log("Prueba")
    //             // console.log(res.body)
    //             res.should.have.status(200);
    //             res.body.should.be.a('array')
    //             res.body.length.should.be.gt(5)
    //             done();

    //          });
    // });

    // it("should insert a new vehicle", async () => {
    //     let dao = new VehicleDao()
    //     let vehicles = await dao.all()
    //     let vehicleCountPreInsert = vehicles.length
    //     let vehicleToInsert = {
    //         "nNumber": "",
    //         "faaNumber": "faaNumber_81128",
    //         "vehicleName": "vehicle_name828",
    //         "manufacturer": "PIXHAWK",
    //         "model": "model_828",
    //         "class": "Fixed wing",
    //         "accessType": "",
    //         "vehicleTypeId": "",
    //         "org-uuid": "",
    //         "registeredBy":"User_1"
    //     }
    //     chai.request(app.app)
    //         .post('/vehicle')
    //         .send(vehicleToInsert)
    //         .end(
    //             async (err, res) => {
    //             // console.log(res.body)
    //             res.should.have.status(200);
    //             res.body.should.have.property('uvin');
    //             let vehicles = await dao.all()
    //             vehicles.length.should.be.gt(vehicleCountPreInsert )
    //          });
    // });


});