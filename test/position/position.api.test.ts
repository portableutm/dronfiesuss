let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { PositionDao } from "../../src/daos/PositionDao";
// import { OperationDao } from "../../src/daos/OperationDaos";
import { app, initAsync } from "../../src/index";

import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";
import { TEST_TIMEOUT } from "../conf";
import { deepCopy } from "../../src/utils/entitiesUtils";
import { Operations } from "../../src/data/operations_data";
import { OperationState } from "../../src/entities/Operation";
import { OperationDao } from "../../src/daos/OperationDaos";

describe('>>> Position entity <<< ', function () {


    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function (application) {
                done()
            }))
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

    describe("Check state change", function () {
        it("should insert a new position in operation", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let gufi = "c42e9384-14d2-9b6b-1c1c-1c3c8aaa2b99"
            let opDao = new OperationDao()
            let op = deepCopy(Operations[0])
            delete op.gufi

            op.gufi = gufi
            op.uas_registrations = []
            op.flight_comments = "For automate Testing operation and position"
            op.state = OperationState.ACTIVATED
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.152325, -34.875792], [-56.152411, -34.881847], [-56.148033, -34.879383], [-56.152325, -34.875792]]] }
            op.operation_volumes[0].min_altitude = 0
            op.operation_volumes[0].max_altitude = 90

            opDao.save(op).then(function (op) {
                let positionToInsert = {
                    "altitude_gps": 30,
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            -56.15069389343262,
                            -34.87936529506962
                        ]
                    },
                    "time_sent": "2019-12-11T19:59:10.000Z",
                    "gufi": gufi,
                    "heading": 160
                }
                chai.request(app.app)
                    .post('/position')
                    .set('auth', token)
                    .send(positionToInsert)
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.should.have.property('id');
                        opDao.one(gufi).then(function (op: any) {
                            op.state.should.eq(OperationState.ACTIVATED)
                            done();
                        }).catch(done)
                    })
                    .catch(done);
            }).catch(done)
        });

        it("should insert a new position outside operation and change the state to rouge", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let gufi = "c42e9384-14d2-9b6b-1c1c-1c3c8aaa2b99"
            let positionToInsert = {
                "altitude_gps": 30,
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -56.15522146224975,
                        -34.87933008912137
                    ]
                },
                "time_sent": "2019-12-11T19:59:10.000Z",
                "gufi": gufi,
                "heading": 160
            }
            chai.request(app.app)
                .post('/position')
                .set('auth', token)
                .send(positionToInsert)
                .then(function (res) {
                    res.should.have.status(200);
                    res.body.should.have.property('id');
                    let opDao = new OperationDao()

                    opDao.one(gufi).then(function (op: any) {
                        op.state.should.eq(OperationState.ROGUE)
                        done();
                    }).catch(done)
                })
                .catch(done);
        });
    })

    describe("Check state change looking on altitude", function () {

        it("should insert a new position in operation", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let gufi = "d12e9172-14d2-9b6b-7b7b-1c3c8ccc1e12"
            let opDao = new OperationDao()
            let op = deepCopy(Operations[0])
            delete op.gufi

            op.gufi = gufi
            op.uas_registrations = []
            op.flight_comments = "For automate Testing operation and altitude"
            op.state = OperationState.ACTIVATED
            op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.151938, -34.88234], [-56.147819, -34.888818], [-56.137991, -34.886424], [-56.147089, -34.880122], [-56.151938, -34.88234]]] }
            op.operation_volumes[0].min_altitude = 0
            op.operation_volumes[0].max_altitude = 90

            opDao.save(op).then(function (op) {
                let positionToInsert = {
                    "altitude_gps": 30,
                    "location": {
                        "type": "Point",
                        "coordinates": [
                            -56.14693880081177,
                            -34.88281540484552
                        ]
                    },
                    "time_sent": "2019-12-11T19:59:10.000Z",
                    "gufi": gufi,
                    "heading": 160
                }
                chai.request(app.app)
                    .post('/position')
                    .set('auth', token)
                    .send(positionToInsert)
                    .then(function (res) {
                        res.should.have.status(200);
                        res.body.should.have.property('id');
                        opDao.one(gufi).then(function (op: any) {
                            op.state.should.eq(OperationState.ACTIVATED)
                            done();
                        }).catch(done)
                    })
                    .catch(done);
            }).catch(done)
        });

        it("should insert a new position outside operation and change the state to rouge", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let gufi = "d12e9172-14d2-9b6b-7b7b-1c3c8ccc1e12"
            let positionToInsert = {
                "altitude_gps": 100,
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -56.14693880081177,
                        -34.88281540484552
                    ]
                },
                "time_sent": "2019-12-11T19:59:10.000Z",
                "gufi": gufi,
                "heading": 160
            }

            chai.request(app.app)
                .post('/position')
                .set('auth', token)
                .send(positionToInsert)
                .then(function (res) {
                    res.should.have.status(200);
                    res.body.should.have.property('id');
                    let opDao = new OperationDao()

                    opDao.one(gufi).then(function (op: any) {
                        op.state.should.eq(OperationState.ROGUE)
                        done();
                    }).catch(done)
                })
                .catch(done);
        });
    })

    // it("should insert a new position outside operation and change the state to rouge", function (done) {
    //     let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
    //     let gufi = "c42e9384-14d2-9b6b-1c1c-1c3c8aaa2b99"
    //     let positionToInsert = {
    //         "altitude_gps": 30,
    //         "location": {
    //             "type": "Point",
    //             "coordinates": [
    //                 -56.15522146224975,
    //                 -34.87933008912137
    //             ]
    //         },
    //         "time_sent": "2019-12-11T19:59:10.000Z",
    //         "gufi": gufi,
    //         "heading": 160
    //     }
    //     chai.request(app.app)
    //         .post('/position')
    //         .set('auth', token)
    //         .send(positionToInsert)
    //         .then(function (res) {
    //             res.should.have.status(200);
    //             res.body.should.have.property('id');
    //             let opDao = new OperationDao()

    //             opDao.one(gufi).then(function (op: any) {
    //                 op.state.should.eq(OperationState.ROGUE)
    //                 done();
    //             }).catch(done)
    //         })
    //         .catch(done);
    // });
    // })



    //TODO check operation change it status
    it("POST /position should insert a new position outside operation", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        // let dao = new PositionDao()
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
            "gufi": "f7891e78-9bb4-431d-94d3-1a506910c254",
            "heading": 160
        }
        chai.request(app.app)
            .post('/position')
            .set('auth', token)
            .send(positionToInsert)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('id');
                done();
            })
            .catch(done);
    });

    it("should insert a new position in operation", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        // let dao = new PositionDao()
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
            "gufi": "f7891e78-9bb4-431d-94d3-1a506910c254",
            "heading": 160
        }
        chai.request(app.app)
            .post('/position')
            .set('auth', token)
            .send(positionToInsert)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('id');
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
            "gufi": "f7891e78-9bb4-431d-94d3-1a506910c254",
            "heading": 200
        }
        chai.request(app.app)
            .post('/position')
            .set('auth', token)
            .send(positionToInsert)
            .then(function (res) {
                res.should.have.status(400);
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
                done();
            })
            .catch(done)
    });

    describe('>>> Position without gufi <<< ', function () {
        it("/POST ", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            // let dao = new PositionDao()
            let positionToInsert = {
                "altitude_gps": 30,
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -56.1636114120483,
                        -34.9068213410793
                    ]
                },
                "time_sent": "2019-12-11T20:39:10.000Z",
                "uvin": "f7891e78-9bb4-431d-94d3-1a506910c254",
                "heading": 0
            }
            chai.request(app.app)
                .post('/position/drone')
                .set('auth', token)
                .send(positionToInsert)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done);
        });

        it("/POST ", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let positionToInsert = {
                "altitude_gps": 30,
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -56.1636114120483,
                        -34.9068213410793
                    ]
                },
                "time_sent": "2019-12-11T20:39:10.000Z",
                "uvin": "a26fdc00-8626-4b08-8b9e-5c50da12fff1",
                "heading": 0
            }
            // let opDao = new OperationDao()
            // opDao.updateState('b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63', OperationState.ACTIVATED).then(
            //     (res) => {
            chai.request(app.app)
                .post('/position/drone')
                .set('auth', token)
                .send(positionToInsert)
                .then(function (res) {
                    res.should.have.status(400);
                    done();
                })
                .catch(done);
            // }).catch(done)
            // });
        })

        it.skip("/POST ", function (done) {
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
            let positionToInsert = {
                "altitude_gps": 30,
                "location": {
                    "type": "Point",
                    "coordinates": [
                        -56.1636114120483,
                        -34.9068213410793
                    ]
                },
                "time_sent": "2019-12-11T20:39:10.000Z",
                "uvin": "a26fdc00-8626-4b08-8b9e-5c50da12fff1",
                "heading": 0
            }
            let opDao = new OperationDao()
            opDao.updateState('b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63', OperationState.ACTIVATED).then(
                (res) => {
                    chai.request(app.app)
                        .post('/position/drone')
                        .set('auth', token)
                        .send(positionToInsert)
                        .then(function (res) {
                            res.should.have.status(200);
                            done();
                        })
                        .catch(done);
                }).catch(done)
        });
    })


});