let chai = require('chai');
let chaiHttp = require('chai-http');
let fs = require('fs');


// Configure chai
chai.use(chaiHttp);
chai.should();
import { VehicleDao } from "../../src/daos/VehicleDao";

import { app, initAsync } from "../../src/index";
import { TEST_TIMEOUT } from "../conf";
import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";

describe('>>> DINACIA Vehicle  entity <<< ', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function (application) {
                done()
            }))
            .catch(done)
    })

    it("POST /vehicle should insert a new vehicle with operators", function (done) {
        let username = 'MaurineFowlie'
        let token = getToken('maurine@dronfies.com', username, Role.PILOT)

        let dao = new VehicleDao()

        let vehicleToInsert :any = {
            "nNumber": "",
            "faaNumber": "faaNumber_81128_DinaciaVehicle",
            "vehicleName": "vehicle_nameDinacia",
            "manufacturer": "PIXHAWK",
            "model": "model_828",
            "class": "Fixed wing",
            "accessType": "",
            "vehicleTypeId": "",
            "org-uuid": "",
            "owner_id": username,
            // "operators": [
            //     { username: "MairGiurio" },
            //     { username: "BettyeStopford" },
            // ],
            // dinacia_vehicle: {
            //     year: "2020"
            // }
        }
        vehicleToInsert.dinacia_vehicle_str = JSON.stringify({year: "2020"})
        chai.request(app.app)
            .post('/vehicle')
            .set('auth', token)
            .send(vehicleToInsert)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('uvin');
                let uvin = res.body.uvin
                dao.one(uvin)
                    .then(function (vehicle) {
                        console.log(`${JSON.stringify(vehicle, null, 2)}`)
                        vehicle.registeredBy.username.should.eq(username)
                        vehicle.operators.length.should.be.equal(0)
                        vehicle.dinacia_vehicle.caa_registration.should.be.a("string")
                        let caa = vehicle.dinacia_vehicle.caa_registration
                        caa.should.include("CX-2020")
                        done();
                    }).catch(done)
            })
            .catch(done);
    });


    it("POST /vehicle should insert a new vehicle with IMAGES", function (done) {
        let username = 'MaurineFowlie'
        let token = getToken('maurine@dronfies.com', username, Role.PILOT)

        let dao = new VehicleDao()

        let vehicleToInsert = {
            "nNumber": "",
            "faaNumber": "faaNumber_81128_DinaciaVehicle",
            "vehicleName": "vehicle_nameDinacia",
            "manufacturer": "PIXHAWK",
            "model": "model_828",
            "class": "Fixed wing",
            "accessType": "",
            "vehicleTypeId": "",
            "org-uuid": "",
            "owner_id": username,

        }
        let operators = [
            { username: "MairGiurio" },
            { username: "BettyeStopford" },
        ]
        let dinacia_vehicle = {
            year: "2021"
        }

        // console.log(`::::> ${__dirname + '/serial.png'}`)
        let req = chai.request(app.app)
            .post('/vehicle')
            .set('auth', token)
            .set('Accept', 'multipart/form-data')

            .field("dinacia_vehicle_str", JSON.stringify(dinacia_vehicle))
            .field("operators_str", JSON.stringify(operators))
            // .field("probando", "emilandia")
            
            
            for (const key in vehicleToInsert) {
                req.field(key, vehicleToInsert[key]);
            }
            
            
            req
            .attach('serial_number_file', fs.readFileSync(__dirname + '/serial.png'), 'serial.png')
            .then(function (res) {
            res.should.have.status(200);
            res.body.should.have.property('uvin');
            let uvin = res.body.uvin
            dao.one(uvin)
                .then(function (vehicle) {
                    console.log(`${JSON.stringify(vehicle, null, 2)}`)
                    vehicle.registeredBy.username.should.eq(username)
                    vehicle.operators.length.should.be.equal(2)
                    vehicle.dinacia_vehicle.caa_registration.should.be.a("string")
                    let caa = vehicle.dinacia_vehicle.caa_registration
                    caa.should.include("CX-2020")
                    done();
                }).catch(done)
        })
            .catch(done);
    });



});