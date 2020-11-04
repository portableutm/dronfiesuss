let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { ParaglidingPositionDao } from "../../src/daos/ParaglidingPositionDao";
import { app, initAsync } from "../../src/index";

import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";
import { TEST_TIMEOUT } from "../conf";
import { deepCopy } from "../../src/utils/entitiesUtils";
import { Operations } from "../../src/data/operations_data";
import { OperationState } from "../../src/entities/Operation";
import { OperationDao } from "../../src/daos/OperationDaos";

describe('>>> Paragliding Position entity <<< ', function () {


    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function (application) {
                done()
            }))
            .catch(done)
    })

    it("GET /paraglidingposition should get all paragliding position", function (done) {
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)

        chai.request(app.app)
            .get('/paraglidingposition')
            .set('auth', token)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('array')
                done();
            })
            .catch(done);
    });

    it("POST /paraglidingposition should insert a paragliding position", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)

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
        }

        chai.request(app.app)
            .post('/paraglidingposition')
            .set('auth', token)
            .send(positionToInsert)
            .then(function (res) {
                // console.log(res.body)
                res.should.have.status(200);
                res.body.should.be.a('object')
                res.body.should.have.property('id');

                done();
            })
            .catch(done);
    });

    
})


