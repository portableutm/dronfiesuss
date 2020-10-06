
let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { OperationDao } from "../../src/daos/OperationDaos";
import { app, initAsync } from "../../src/index";

import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";
import { RestrictedFlightVolume } from "../../src/entities/RestrictedFlightVolume";
import { deepCopy } from "../../src/utils/entitiesUtils";
import { Operations } from "../../src/data/operations_data";
import { OperationState, Operation } from "../../src/entities/Operation";
import { TEST_TIMEOUT } from "../conf"; 

describe('>>> Restricted Flight VOlume volume reservation entity <<< ', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function(application){
                done()
            }))
            .catch(done)
    })

    it("GET /restrictedflightvolume should get all rfv records", function (done) {
        chai.request(app.app)
            .get('/restrictedflightvolume')
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.equal(2)
                done();
            })
            .catch(done);
    });

    it("GET /restrictedflightvolume/056ccb91-c58c-439b-93a0-592e19cba0b8 should get a single RFV", function (done) {
        chai.request(app.app)
            .get('/restrictedflightvolume/056ccb91-c58c-439b-93a0-592e19cba0b8')
            .set('bypass', 'a')
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('object')
                res.body.should.have.property('max_altitude').equal("50")
                res.body.should.have.property('min_altitude').equal("0")
                res.body.should.have.property('geography').be.a('object')
                res.body.should.have.property('comments').equal("Airport MVD")
                done();
            })
            .catch(done);
    });


    it("POST /restrictedflightvolume should insert a new rfv", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        let rfv = {
            geography: {"type":"Polygon","coordinates":[[[-56.309738,-34.874384],[-56.309395,-34.903671],[-56.245537,-34.9017],[-56.24588,-34.864806],[-56.310081,-34.872975],[-56.309738,-34.874384]]]},
            max_altitude: 100,
            min_altitude: 0,
            comments: "Montevideo Hill"
        }
        chai.request(app.app)
            .post('/restrictedflightvolume')
            .set('auth', token)
            .send(rfv)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('object')
                res.body.should.have.property("id")
                done();
            })
            .catch(done);
    });

    it("POST /restrictedflightvolume should NOT insert a new rfv with bad parameters", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        let rfv = {
            geography: {"BadParameters":[[[-56.309738,-34.874384],[-56.309395,-34.903671],[-56.245537,-34.9017],[-56.24588,-34.864806],[-56.310081,-34.872975],[-56.309738,-34.874384]]]},
            max_altitude: 100,
            comments: "Bad Parameters"
        }
        chai.request(app.app)
            .post('/restrictedflightvolume')
            .set('auth', token)
            .send(rfv)
            .then(function (res) {
                res.should.have.status(400);
                done();
            })
            .catch(done);
    });


    it("POST /restrictedflightvolume should insert a new rfv over a operation that must change its state", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        let op1Poly = {"type":"Polygon","coordinates":[[[-56.181335,-34.854665],[-56.192322,-34.876918],[-56.15181,-34.872693],[-56.15181,-34.86537],[-56.155243,-34.853538],[-56.181335,-34.854665]]]}
        let opVol: any = {
            "effective_time_begin": "2020-03-11T14:00:00.000Z",
            "effective_time_end": "2020-03-11T15:00:00.000Z",
            "max_altitude": "50",
            "min_altitude": "20",
            operation_geography: op1Poly
        }

        let op = Object.assign({}, deepCopy(Operations[0]))
        delete op.gufi 

        // op.gufi = undefined
        op.uas_registrations = []
        op.flight_comments = "For automate Testing RFV "
        op.state = OperationState.PROPOSED
        op.operation_volumes[0] = Object.assign(op.operation_volumes[0], deepCopy(opVol)) //.operation_geography = op1Poly // = "For automate Testing operation "


        const opDao = new OperationDao();
        opDao.save(op).then(function(op:any){
            let gufi1 = op.gufi

            let rfv = {
                geography: {"type":"Polygon","coordinates":[[[-56.216354,-34.853538],[-56.219101,-34.874947],[-56.172066,-34.86706],[-56.216354,-34.853538]]]},
                max_altitude: 100,
                min_altitude: 0,
                comments: "And other RFV for testing a cross operation"
            }
            chai.request(app.app)
                .post('/restrictedflightvolume')
                .set('auth', token)
                .send(rfv)
                .then(function (res) {
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property("id")
                    opDao.one(gufi1).then(function (op) {
                        op.should.have.property('state').equal(OperationState.PENDING);
                            done();
                    }).catch(done)
                })
                .catch(done);

        }).catch(done)



        
    });

    


});

