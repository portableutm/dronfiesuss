let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();

import { getToken } from "../../src/services/tokenService";
import { Operations } from "../../src/data/operations_data";
import { deepCopy } from "../../src/utils/entitiesUtils";


import { app, initAsync } from "../../src/index";
import { Role } from "../../src/entities/User";
import { OperationState, Operation } from "../../src/entities/Operation";
import { TEST_TIMEOUT } from "../conf";
import { OperationDao } from "../../src/daos/OperationDaos";
import { ApprovalDao } from "../../src/daos/ApprovalDao";
import { Users } from "../../src/data/users_data";


describe(' >>> Operation test <<< ', function () {

    // this.timeout(3000);
    before(function (done) {
        this.timeout(TEST_TIMEOUT);

        initAsync()
            // .then(done)
            .then((function (application) {
                done()
            }))
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

    it("Should not get all operations for admin user ADMIN", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        chai.request(app.app)
            .get('/operation')
            .set('auth', token)
            .set('Accept', 'application/json')
            .then(function (res) {
                res.should.have.status(200);
                res.body.ops.length.should.be.eq(4)
                done();
            })
            .catch(done)
    });

    it("Should not get 2 operations for operator user with rolle ADMIN", function (done) {
        let token = getToken('operator@dronfies.com', 'operator', Role.ADMIN)
        chai.request(app.app)
            .get('/operation')
            .set('auth', token)
            .set('Accept', 'application/json')
            .then(function (res) {
                res.should.have.status(200);
                res.body.ops.length.should.be.eq(2)
                done();
            })
            .catch(done)
    });


    it("Should not get all operations if user role is not ADMIN", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)

        chai.request(app.app)
            .get('/operation')
            .set('auth', token)
            .set('Accept', 'application/json')
            .then(function (res) {
                res.should.have.status(401);
                done();
            })
            .catch(done)

    });

    it("Should get 2 operations by creator MaurineFowlie", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
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

    it("Should get 2 operations by creator MaurineFowlie", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        chai.request(app.app)
            .get('/operation/owner')
            .set('auth', token)
            .set('Accept', 'application/json')
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

    it("Should get an operation of MaurineFowlie with admin user", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
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

    describe("Pending operations", function () {
        it("Should pass an operation in pending to accepted", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let op = deepCopy(Operations[0])
            delete op.gufi

            let newGufi = '6703cf4f-cf7f-4175-aaf4-aee02d59f3a3'

            op.gufi = newGufi
            op.uas_registrations = []
            op.flight_comments = "For automate Testing operation "
            op.state = OperationState.PENDING
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.215668, -34.906628], [-56.212749, -34.912751], [-56.207514, -34.910429], [-56.210947, -34.904516], [-56.215668, -34.906628]]] }

            const opDao = new OperationDao();
            const approvalDao = new ApprovalDao()

            opDao.save(op).then(function (op: any) {
                chai.request(app.app)
                    .post(`/operation/${newGufi}/pendingtoaccept`)
                    .set('auth', token)
                    .send({ comments: "", approved: true })
                    .set('Accept', 'application/json')
                    .then(function (res) {
                        res.should.have.status(200);
                        console.log(res.body)
                        opDao.one(newGufi).then(function (op) {
                            op.state.should.eq(OperationState.ACCEPTED)
                            approvalDao.one(res.body.id).then(function (app) {
                                app.operation.gufi.should.eq(newGufi)
                                // app.operation.gufi.should.eq()  
                                // app.operation.gufi.should.eq(newGufi)  
                                done();
                            }).catch(done)
                        }).catch(done)
                    }).catch(done)
            }).catch(done)
        })

        it("Should pass an operation in pending to CLOSED", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let op = deepCopy(Operations[0])
            delete op.gufi

            let newGufi = 'd835b903-a62d-4ccd-a711-d1ee49dd09a5'

            op.gufi = newGufi
            op.uas_registrations = []
            op.flight_comments = "For automate Testing operation "
            op.state = OperationState.PENDING
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.194038, -34.904657], [-56.193523, -34.908669], [-56.188545, -34.90698], [-56.188889, -34.902052], [-56.194038, -34.904657]]] }

            const opDao = new OperationDao();
            const approvalDao = new ApprovalDao()

            opDao.save(op).then(function (op: any) {
                chai.request(app.app)
                    .post(`/operation/${newGufi}/pendingtoaccept`)
                    .set('auth', token)
                    .send({ comments: "", approved: false })
                    .set('Accept', 'application/json')
                    .then(function (res) {
                        res.should.have.status(200);
                        console.log(res.body)
                        opDao.one(newGufi).then(function (op) {
                            op.state.should.eq(OperationState.CLOSED)
                            approvalDao.one(res.body.id).then(function (app) {
                                app.operation.gufi.should.eq(newGufi)
                                done();
                            }).catch(done)
                        }).catch(done)
                    }).catch(done)
            }).catch(done)
        })

        it("Should not accept operation beacause the sate was NOT_ACCPETED", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let op = deepCopy(Operations[0])
            delete op.gufi

            let newGufi = '9383cf4f-cf7f-4175-aaf4-aee42d23e6b4'

            op.gufi = newGufi
            op.uas_registrations = []
            op.flight_comments = "For automate Testing operation "
            op.state = OperationState.NOT_ACCEPTED
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.215668, -34.906628], [-56.212749, -34.912751], [-56.207514, -34.910429], [-56.210947, -34.904516], [-56.215668, -34.906628]]] }

            const opDao = new OperationDao();
            opDao.save(op).then(function (op: any) {
                chai.request(app.app)
                    .get(`/operation/${newGufi}/pendingtoaccept`)
                    .set('auth', token)
                    .set('Accept', 'application/json')
                    .then(function (res) {
                        console.log(res.body)
                        res.should.have.status(404);
                        opDao.one(newGufi).then(function (op) {
                            op.state.should.eq(OperationState.NOT_ACCEPTED)
                            done();
                        }).catch(done)
                    }).catch(done)
            }).catch(done)
        });

    })

    it("POST /operation should create a new operation", function (done) {
        let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
        let op = deepCopy(Operations[0])
        delete op.gufi
        
        op.owner = Users[0]

        op.uas_registrations = []
        op.flight_comments = "For automate Testing operation "
        op.state = OperationState.PROPOSED
        op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

        // let gufi = 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63'
        chai.request(app.app)
            .post(`/operation/`)
            .set('auth', token)
            .set('Accept', 'application/json')
            .send(op)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('state').equal(OperationState.PROPOSED);
                res.body.should.have.property('gufi').be.a('string')
                done();
            })
            .catch(done)
    });

    it("POST /operation should not create a new operation when passing invalid vehicle", function (done) {
        let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
        let op = deepCopy(Operations[0])
        delete op.gufi
        // let opt : Operation = {}
        // opt.state
        // op.uas_registrations = []
        op.flight_comments = "For automate Testing operation "
        op.state = OperationState.PROPOSED

        op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

        // let gufi = 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63'
        chai.request(app.app)
            .post(`/operation/`)
            .set('auth', token)
            .set('Accept', 'application/json')
            .send(op)
            .then(function (res) {
                res.should.have.status(400);
                done();
            })
            .catch(done)
    });

    describe(' Operation volume validations', function () {

        it("POST /operation should not create a new operation when passing invalid operation volume", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op = deepCopy(Operations[0])
            delete op.gufi
            op.operation_volumes = []
            op.flight_comments = "For automate Testing operation "
            op.state = OperationState.PROPOSED
            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid min (min) altitude", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi
            op.operation_volumes[0].min_altitude = -500
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            // let gufi = 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63'
            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid min (max) altitude", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi
            op.operation_volumes[0].min_altitude = 20
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid max (min) altitude", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi

            op.operation_volumes[0].max_altitude = -1
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            // let gufi = 'b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63'
            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid max (max) altitude", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi
            op.operation_volumes[0].max_altitude = 401
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid effective_time_begin format", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi
            // op.operation_volumes[0].effective_time_begin = "2020-01-02T20:20:20.000Z" //valid example
            op.operation_volumes[0].effective_time_begin = "2020-01-02T20:20:20.000"
            op.operation_volumes[0].effective_time_end = "2020-01-02T21:20:20.000Z"
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid effective_time_end format", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi
            // op.operation_volumes[0].effective_time_begin = "2020-01-02T20:20:20.000Z" //valid example
            op.operation_volumes[0].effective_time_begin = "2020-01-02T20:20:20.000Z"
            op.operation_volumes[0].effective_time_end = "2020-01-02T21:20:20.000"
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid date range effective_time_end lower than effective_time_begin", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi
            // op.operation_volumes[0].effective_time_begin = "2020-01-02T20:20:20.000Z" //valid example
            op.operation_volumes[0].effective_time_begin = "2020-01-02T21:20:20.000Z"
            op.operation_volumes[0].effective_time_end = "2020-01-02T20:20:20.000Z"
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid short date range", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi
            // op.operation_volumes[0].effective_time_begin = "2020-01-02T20:20:20.000Z" //valid example
            op.operation_volumes[0].effective_time_begin = "2020-01-02T20:20:20.000Z"
            op.operation_volumes[0].effective_time_end = "2020-01-02T20:30:20.000Z"
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });

        it("POST /operation should not create a new operation when passing invalid large date range", function (done) {
            let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
            let op: Operation = deepCopy(Operations[0])
            delete op.gufi
            // op.operation_volumes[0].effective_time_begin = "2020-01-02T20:20:20.000Z" //valid example
            op.operation_volumes[0].effective_time_begin = "2020-01-02T15:00:20.000Z"
            op.operation_volumes[0].effective_time_end = "2020-01-02T20:30:20.000Z"
            op.flight_comments = "For automate Testing operation "
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.16193771362305, -34.90275631306831], [-56.161251068115234, -34.90662777287992], [-56.154985427856445, -34.906486995721075], [-56.155757904052734, -34.90233396095623], [-56.16193771362305, -34.90275631306831]]] }

            chai.request(app.app)
                .post(`/operation/`)
                .set('auth', token)
                .set('Accept', 'application/json')
                .send(op)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done)
        });


    })


    describe(' Operation pagination ', function () {
        it("should get the two operations in diferent pages", function (done) {
            let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
            chai.request(app.app)
                .get('/operation/owner')
                .query({ limit: 1, offset: 0 })
                .set('auth', token)
                .set('Accept', 'application/json')
                .then(function (res) {
                    res.should.have.status(200);
                    res.body.ops.length.should.be.eq(1)
                    let gufi1 = res.body.ops[0].gufi
                    chai.request(app.app)
                        .get('/operation/owner')
                        .query({ limit: 1, offset: 1 })
                        .set('auth', token)
                        .set('Accept', 'application/json')
                        .then(function (res) {
                            res.should.have.status(200);
                            res.body.ops.length.should.be.eq(1)
                            res.body.ops[0].gufi.should.not.eq(gufi1)
                            done();
                        })
                        .catch(done)
                })
                .catch(done)
        });
    })
});