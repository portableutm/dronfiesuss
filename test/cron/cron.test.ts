let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { VehicleDao } from "../../src/daos/VehicleDao";

import { app, init, initAsync } from "../../src/index";

describe.skip('>>> Cron test <<<', function () {

    before(async () => {
        await initAsync()
    })

    it("Should pass a operation from proposed to closed because there are an other operation")
    it("Should pass a operation from proposed to closed because there are an uvr")
    it("...")


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