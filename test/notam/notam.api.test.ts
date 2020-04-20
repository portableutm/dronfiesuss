let chai = require('chai');
let chaiHttp = require('chai-http');
import { Polygon } from "geojson";


// Configure chai
chai.use(chaiHttp);
chai.should();
import { NotamDao } from "../../src/daos/NotamDao";

import { app, init, initAsync } from "../../src/index";
import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";
import { Notams } from "../../src/entities/Notams";

describe.only(' >>> Notams test <<< ', function () {

    before(function (done) {
        this.timeout(5000);
        initAsync()
            .then(done)
            .catch(done)
    })

    it("/GET /notam should get 2 notam", function (done) {
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        chai.request(app.app)
            .get('/notam/')
            .set('Accept', 'application/json')
            // .set('bypass', "a")
            .set('auth', token)
            .then(res => {
                // console.log(res.body)
                res.should.have.status(200);
                res.body.length.should.be.eq(2)
                done()
            })
            .catch(done);
    });

    it("/GET /notam/f2308be3-80a5-4247-964a-b541a1634331 should get a notam ", function (done) {
        let message_id ="f2308be3-80a5-4247-964a-b541a1634331"
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        chai.request(app.app)
            .get(`/notam/${message_id}`)
            .set('Accept', 'application/json')
            .set('auth', token)
            .then(res => {
                res.should.have.status(200);
                let notam : Notams = res.body
                notam.should.have.property('message_id').equal(message_id)
                done()
            })
            .catch(done);
    });

    it("/POST /notam/ should insert a notam ", function (done) {
        // let message_id ="f2308be3-80a5-4247-964a-b541a1634331"
        let poly : Polygon = { "type": "Polygon", "coordinates": [ [ [ -56.17652893066406, -34.895857623250066 ], [ -56.18107795715332, -34.90493843104419 ], [ -56.17069244384765, -34.909091334089794 ], [ -56.164255142211914, -34.90092610489535 ], [ -56.17652893066406, -34.895857623250066 ] ] ] }
        let notam1 : Notams = {
            text : "For test",
            geography: poly,
            effective_time_begin: "2020-04-20T14:00:00Z",
            effective_time_end: "2020-04-21T14:00:00Z",
        }
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        chai.request(app.app)
            .post(`/notam/`)
            .set('Accept', 'application/json')
            .set('auth', token)
            .send(notam1)
            .then(res => {
                // console.log(res.body)
                res.should.have.status(200);
                let notam : Notams = res.body
                notam.should.have.property('message_id').be.a("string")
                done()
            })
            .catch(function(error){
                console.log(error)
                done(error)
            });
    });





});