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
import { sleepPromise } from "../../src/utils/miscUtils";



import { smtpUsername, smtpPassword } from "../../src/config/config";
import { generateAuthorizeVehicleMailHTML } from "../../src/utils/mailContentUtil";



describe('>>> Vehicle entity <<< ', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function (application) {
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
        let token = getToken('maurine@dronfies.com', username, Role.PILOT)

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
            "owner_id": username
        }

        let req = chai.request(app.app)
            .post('/vehicle')
            .set('auth', token)
            .set('Accept', 'multipart/form-data')

        for (const key in vehicleToInsert) {
            req.field(key, vehicleToInsert[key]);
        }

        req.then(function (res) {
            res.should.have.status(200);
            res.body.should.have.property('uvin');
            let uvin = res.body.uvin
            dao.all()
                .then(function (vehicles) {
                    vehicles.length.should.be.eq(vehicleCountPreInsert + 1)
                    dao.one(uvin)
                        .then(function (vehicle) {
                            vehicle.registeredBy.username.should.eq(username)
                            done();
                        }).catch(done)
                }).catch(done)
        })
            .catch(done);
    });

    it("POST /vehicle should not insert a new vehicle because the owner does not exist", function (done) {
        let username = 'MaurineFowlie'
        let token = getToken('maurine@dronfies.com', username, Role.PILOT)

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
            "owner_id": "croc!" //username
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



    it("POST /vehicle should insert a new vehicle with operators", function (done) {
        let username = 'MaurineFowlie'
        let token = getToken('maurine@dronfies.com', username, Role.PILOT)

        let dao = new VehicleDao()

        let vehicleToInsert = {
            "nNumber": "",
            "faaNumber": "faaNumber_81128_Operator_test1",
            "vehicleName": "vehicle_name828",
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
            // ]
        }
        let operators = [
            { username: "MairGiurio" },
            { username: "BettyeStopford" },
        ]
        let req = chai.request(app.app)
            .post('/vehicle')
            .set('auth', token)
            .set('Accept', 'multipart/form-data')
            .field("operators_str", JSON.stringify(operators))

        for (const key in vehicleToInsert) {
            req.field(key, vehicleToInsert[key]);
        }

        req.then(function (res) {
            res.should.have.status(200);
            res.body.should.have.property('uvin');
            let uvin = res.body.uvin
            dao.one(uvin)
                .then(function (vehicle) {
                    console.log(`${JSON.stringify(vehicle, null, 2)}`)
                    vehicle.registeredBy.username.should.eq(username)
                    vehicle.operators.length.should.be.equal(2)
                    done();
                }).catch(done)
        })
            .catch(done);
    });

    it("POST /vehicle should fail operators username not exists", function (done) {
        let username = 'MaurineFowlie'
        let token = getToken('maurine@dronfies.com', username, Role.PILOT)

        let dao = new VehicleDao()

        let vehicleToInsert = {
            "nNumber": "",
            "faaNumber": "faaNumber_81128_Operator_test2",
            "vehicleName": "vehicle_name828",
            "manufacturer": "PIXHAWK",
            "model": "model_828",
            "class": "Fixed wing",
            "accessType": "",
            "vehicleTypeId": "",
            "org-uuid": "",
            "owner_id": username,
            // "operators": [
            //     { username: "MairGiurio" },
            //     { username: "NoExisteUsuario" },
            // ]
        }
        let operators = [
            { username: "MairGiurio" },
            { username: "NoExisteUsuario" },
        ]

        let req = chai.request(app.app)
            .post('/vehicle')
            .set('auth', token)
            .set('Accept', 'multipart/form-data')
            .field("operators_str", JSON.stringify(operators))

        for (const key in vehicleToInsert) {
            req.field(key, vehicleToInsert[key]);
        }

        req.then(function (res) {
            res.should.have.status(400);
            done();
        })
            .catch(done);
    });


    it("POST /vehicle get vehicles by operator", function (done) {
        let username = 'MaurineFowlie'
        let token = getToken('maurine@dronfies.com', username, Role.PILOT)
        let dao = new VehicleDao()
        let vehicleToInsert = {
            "nNumber": "",
            "faaNumber": "faaNumber_81128_Operator_test2",
            "vehicleName": "vehicle_name828",
            "manufacturer": "PIXHAWK",
            "model": "model_828",
            "class": "Fixed wing",
            "accessType": "",
            "vehicleTypeId": "",
            "org-uuid": "",
            "owner_id": username,
            // "operators": [
            //     { username: "MaurineFowlie" },
            //     { username: "BettyeStopford" },
            // ]
        }
        let operators = [
            { username: "MaurineFowlie" },
            { username: "BettyeStopford" },
        ]

        let req = chai.request(app.app)
            .post('/vehicle')
            .set('auth', token)
            .set('Accept', 'multipart/form-data')
            .field("operators_str", JSON.stringify(operators))

        for (const key in vehicleToInsert) {
            req.field(key, vehicleToInsert[key]);
        }

        req.then(function (res) {
            res.should.have.status(200);

            chai.request(app.app)
                .get('/vehicle/operator')
                .set('auth', token)
                .then(function (res) {
                    res.should.have.status(200);
                    // console.log(`resp:Operator:${JSON.stringify(res.body)}`)
                    res.body.length.should.be.equal(1)
                    done();
                })
                .catch(done);
        })
            .catch(done);
    });


    describe("Vehicle authorization", function () {
        it("POST /vehicle/authorize authorize the registred vehicle", function (done) {
            let username = 'MaurineFowlie'
            let token = getToken('admin@dronfies.com', "admin", Role.ADMIN)
            let dao = new VehicleDao()
            let vehicleToInsert = {
                "nNumber": "",
                "faaNumber": "faaNumber_81128_Operator_test2",
                "vehicleName": "vehicle_name828",
                "manufacturer": "PIXHAWK",
                "model": "model_828",
                "class": "Fixed wing",
                "accessType": "",
                "vehicleTypeId": "",
                "org-uuid": "",
                "owner_id": username,
                // "operators": [
                //     { username: "MaurineFowlie" },
                //     { username: "BettyeStopford" },
                // ]
            }
            let operators = [
                { username: "MaurineFowlie" },
                { username: "BettyeStopford" },
            ]
            let req = chai.request(app.app)
                .post('/vehicle')
                .set('auth', token)
                .set('Accept', 'multipart/form-data')
                .field("operators_str", JSON.stringify(operators))

            for (const key in vehicleToInsert) {
                req.field(key, vehicleToInsert[key]);
            }

            req.then(function (res) {
                res.should.have.status(200);

                res.body.authorized.should.be.equal('PENDING')
                let uvin = res.body.uvin
                uvin.should.be.a('string')

                let uvinToAuthorize = {
                    id: uvin,
                    status: 'AUTHORIZED'
                }

                chai.request(app.app)
                    .post('/vehicle/authorize')
                    .set('auth', token)
                    .send(uvinToAuthorize)
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.authorized.should.be.equal('AUTHORIZED')
                        let vehicle = res.body

                        sleepPromise(1000).then(() => {
                            chai.request('http://localhost:1080')
                                // /api/emails?from=joe@example.com&to=bob@example.com&since=2017-09-18T12:00:00Z&until=2017-09-19T00:00:00Z
                                .get(`/api/emails`)
                                .auth(smtpUsername, smtpPassword)
                                .then(res => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    let mail = res.body[0]
                                    // console.log(`Mail: ${JSON.stringify(mail, null, 2)} `)
                                    mail.subject.should.include('Información sobre authorización');
                                    mail.html.should.include(generateAuthorizeVehicleMailHTML(vehicle));
                                    done()
                                })
                                .catch(done)
                        }).catch(done)

                    })
                    .catch(done);
            })
                .catch(done);
        });

        it("POST /vehicle/authorize NOT_AUTHORIZE the registred vehicle", function (done) {
            let username = 'MaurineFowlie'
            let token = getToken('admin@dronfies.com', "admin", Role.ADMIN)
            let dao = new VehicleDao()
            let vehicleToInsert = {
                "nNumber": "",
                "faaNumber": "faaNumber_81128_Operator_test2",
                "vehicleName": "vehicle_name828",
                "manufacturer": "PIXHAWK",
                "model": "model_828",
                "class": "Fixed wing",
                "accessType": "",
                "vehicleTypeId": "",
                "org-uuid": "",
                "owner_id": username,
                // "operators": [
                //     { username: "MaurineFowlie" },
                //     { username: "BettyeStopford" },
                // ]
            }
            let operators = [
                { username: "MaurineFowlie" },
                { username: "BettyeStopford" },
            ]
            let req = chai.request(app.app)
                .post('/vehicle')
                .set('auth', token)
                .set('Accept', 'multipart/form-data')
                .field("operators_str", JSON.stringify(operators))

            for (const key in vehicleToInsert) {
                req.field(key, vehicleToInsert[key]);
            }

            req.then(function (res) {
                res.should.have.status(200);

                res.body.authorized.should.be.equal('PENDING')
                let uvin = res.body.uvin
                uvin.should.be.a('string')

                let uvinToAuthorize = {
                    id: uvin,
                    status: 'NOT_AUTHORIZED'
                }

                chai.request(app.app)
                    .post('/vehicle/authorize')
                    .set('auth', token)
                    .send(uvinToAuthorize)
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.authorized.should.be.equal('NOT_AUTHORIZED')
                        let vehicle = res.body

                        sleepPromise(1000).then(() => {
                            chai.request('http://localhost:1080')
                                // /api/emails?from=joe@example.com&to=bob@example.com&since=2017-09-18T12:00:00Z&until=2017-09-19T00:00:00Z
                                .get(`/api/emails`)
                                .auth(smtpUsername, smtpPassword)
                                .then(res => {
                                    res.should.have.status(200);
                                    res.body.should.be.a('array');
                                    let mail = res.body[0]
                                    // console.log(`Mail: ${JSON.stringify(mail, null, 2)} `)
                                    mail.subject.should.include('Información sobre authorización');
                                    mail.html.should.include(generateAuthorizeVehicleMailHTML(vehicle));

                                    done()

                                })
                                .catch(done)
                        }).catch(done)
                    })
                    .catch(done);
            })
                .catch(done);
        });
        

        it("POST /vehicle/authorize should fail if no user admin authorize ", function (done) {
            let username = 'MaurineFowlie'
            let token = getToken('maurine@dronfies.com', username, Role.PILOT)
            let dao = new VehicleDao()
            let vehicleToInsert = {
                "nNumber": "",
                "faaNumber": "faaNumber_81128_Operator_test2",
                "vehicleName": "vehicle_name828",
                "manufacturer": "PIXHAWK",
                "model": "model_828",
                "class": "Fixed wing",
                "accessType": "",
                "vehicleTypeId": "",
                "org-uuid": "",
                "owner_id": username,
                "operators": [
                    { username: "MaurineFowlie" },
                    { username: "BettyeStopford" },
                ]
            }
            chai.request(app.app)
                .post('/vehicle')
                .set('auth', token)
                .send(vehicleToInsert)
                .then(function (res) {
                    console.log(res)
                    res.should.have.status(200);

                    res.body.authorized.should.be.equal('PENDING')
                    let uvin = res.body.uvin
                    uvin.should.be.a('string')

                    let uvinToAuthorize = {
                        id: uvin
                    }

                    chai.request(app.app)
                        .post('/vehicle/authorize')
                        .set('auth', token)
                        .send(uvinToAuthorize)
                        .then(function (res) {
                            res.should.have.status(401);
                            done();
                        })
                        .catch(done);
                })
                .catch(done);
        });

    })



});