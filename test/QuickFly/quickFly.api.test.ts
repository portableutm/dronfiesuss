
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

describe('>>> QuickFly <<< ', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function(application){
                done()
            }))
            .catch(done)
    })

    it("POST /quickfly ", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        let quickfly = {
            name: "QuickFly test",
            cornerNW: {
                "type": "Point",
                "coordinates": [
                  -56.16202354431152,
                  -34.91211789381226
                ]
              },
            cornerSE: {
                "type": "Point",
                "coordinates": [
                  -56.14545822143555,
                  -34.91922635107831
                ]
              },
        }
        chai.request(app.app)
            .post('/quickfly')
            .set('auth', token)
            .send(quickfly)
            .then(function (res) {
                res.should.have.status(200);
                // res.body.should.be.a('array')
                // res.body.length.should.be.equal(2)
                done();
            })
            .catch(done);
    });

    it("GET /quickfly", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        chai.request(app.app)
            .get('/quickfly/')
            .set('auth', token)
            .then(function (res) {
                // console.log(res.body)
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.equal(1)
                done();
            })
            .catch(done);
    });

    it("GET /quickfly", function (done) {
        let token = getToken('operator@dronfies.com', 'operator', Role.ADMIN)
        chai.request(app.app)
            .get('/quickfly/')
            .set('auth', token)
            .then(function (res) {
                // console.log(res.body)
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.equal(0)
                done();
            })
            .catch(done);
    });

});

