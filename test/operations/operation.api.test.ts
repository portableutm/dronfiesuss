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

describe.only(' >>> Operation test <<< ', function () {

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

    it("POST /operation should create a new operation", function (done) {
        let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
        let op = deepCopy(Operations[0])
        // let opt : Operation = {}
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

});