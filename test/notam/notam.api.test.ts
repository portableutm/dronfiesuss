let chai = require('chai');
let chaiHttp = require('chai-http');
import { Polygon } from "geojson";


// Configure chai
chai.use(chaiHttp);
chai.should();
import { NotamDao } from "../../src/daos/NotamDao";

import { app, initAsync } from "../../src/index";
import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";
import { Notams } from "../../src/entities/Notams";
import { TEST_TIMEOUT } from "../conf"; 

describe(' >>> Notams test <<< ', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function(application){
                done()
            }))
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

    describe(' Testing notams filters', function(){

        it("/GET /notam with polygon should get 1 notam with id 1b5f39e6-11e8-4f6b-b32c-3c94bee4a892 ", function (done) {
            let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
            let polygon = "%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-56.143227%2C-34.898885%5D%2C%5B-56.143827%2C-34.902756%5D%2C%5B-56.128893%2C-34.901912%5D%2C%5B-56.128893%2C-34.897688%5D%2C%5B-56.143227%2C-34.898885%5D%5D%5D%7D"
            chai.request(app.app)
                .get('/notam/')
                .set('Accept', 'application/json')
                .query({polygon: polygon}) 
                .set('auth', token)
                .then(res => {
                    // console.log(`Response::${JSON.stringify(res.body)}`)
                    res.should.have.status(200);
                    res.body.length.should.be.eq(1)
                    res.body[0].should.have.property("message_id").equal("1b5f39e6-11e8-4f6b-b32c-3c94bee4a892")
                    done()
                })
                .catch(done);
        });
    
        it("/GET /notam with polygon should get 1 notam f2308be3-80a5-4247-964a-b541a1634331", function (done) {
            let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
            let polygon = "%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-56.175671%2C-34.922182%5D%2C%5B-56.173267%2C-34.927319%5D%2C%5B-56.145029%2C-34.923519%5D%2C%5B-56.143913%2C-34.919578%5D%2C%5B-56.175671%2C-34.922182%5D%5D%5D%7D"
            chai.request(app.app)
                .get('/notam/')
                .set('Accept', 'application/json')
                .query({polygon: polygon}) 
                .set('auth', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.length.should.be.eq(1)     
                    res.body[0].should.have.property("message_id").equal("f2308be3-80a5-4247-964a-b541a1634331")
                    done()
                })
                .catch(done);
        });


        it("/GET /notam with a bad polygon should get status 400", function (done) {
            let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
            let polygon = "%7B%22type%22%32C%5B-56.173267%2C-34.927319%5D%2C%5B-56.145029%2C-34.923519%5D%2C%5B-56.143913%2C-34.919578%5D%2C%5B-56.175671%2C-34.922182%5D%5D%5D%7D"
            chai.request(app.app)
                .get('/notam/')
                .set('Accept', 'application/json')
                .query({polygon: polygon}) 
                .set('auth', token)
                .then(res => {
                    res.should.have.status(400);
                    done()
                })
                .catch(done);
        });
    
        it("/GET /notam with polygon should not get any notam", function (done) {
            let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
            let polygon = "%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-56.224079%2C-34.906065%5D%2C%5B-56.230602%2C-34.917889%5D%2C%5B-56.210346%2C-34.920845%5D%2C%5B-56.203308%2C-34.905924%5D%2C%5B-56.224079%2C-34.906065%5D%5D%5D%7D"
            chai.request(app.app)
                .get('/notam/')
                .set('Accept', 'application/json')
                .query({polygon: polygon}) 
                .set('auth', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.length.should.be.eq(0)     
                    done()
                })
                .catch(done);
        });


        it("/GET /notam with date:2020-04-11T16:00:00Z should get 1 notam with id 1b5f39e6-11e8-4f6b-b32c-3c94bee4a892 ", function (done) {
            let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
            let polygon = "%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-56.143227%2C-34.898885%5D%2C%5B-56.143827%2C-34.902756%5D%2C%5B-56.128893%2C-34.901912%5D%2C%5B-56.128893%2C-34.897688%5D%2C%5B-56.143227%2C-34.898885%5D%5D%5D%7D"
            let date = "2020-04-11T16:00:00Z"
            chai.request(app.app)
                .get('/notam/')
                .set('Accept', 'application/json')
                .query({date:date}) 
                .set('auth', token)
                .then(res => {
                    // console.log(`Response::${JSON.stringify(res.body)}`)
                    res.should.have.status(200);
                    res.body.length.should.be.eq(1)
                    res.body[0].should.have.property("message_id").equal("1b5f39e6-11e8-4f6b-b32c-3c94bee4a892")
                    done()
                })
                .catch(done);
        });

        it("/GET /notam with polygon and date:2020-04-11T16:00:00Z should get 1 notam with id 1b5f39e6-11e8-4f6b-b32c-3c94bee4a892 ", function (done) {
            let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
            let polygon = "%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-56.143227%2C-34.898885%5D%2C%5B-56.143827%2C-34.902756%5D%2C%5B-56.128893%2C-34.901912%5D%2C%5B-56.128893%2C-34.897688%5D%2C%5B-56.143227%2C-34.898885%5D%5D%5D%7D"
            let date = "2020-04-11T16:00:00Z"
            chai.request(app.app)
                .get('/notam/')
                .set('Accept', 'application/json')
                .query({polygon: polygon, date:date}) 
                .set('auth', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.length.should.be.eq(1)
                    res.body[0].should.have.property("message_id").equal("1b5f39e6-11e8-4f6b-b32c-3c94bee4a892")
                    done()
                })
                .catch(done);
        });

        it("/GET /notam with polygon and date:2020-04-11T12:00:00Z should any notam (date is before the 1b5f39e6-11e8-4f6b-b32c-3c94bee4a892 notam) ", function (done) {
            let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
            let polygon = "%7B%22type%22%3A%22Polygon%22%2C%22coordinates%22%3A%5B%5B%5B-56.143227%2C-34.898885%5D%2C%5B-56.143827%2C-34.902756%5D%2C%5B-56.128893%2C-34.901912%5D%2C%5B-56.128893%2C-34.897688%5D%2C%5B-56.143227%2C-34.898885%5D%5D%5D%7D"
            let date = "2020-04-11T12:00:00Z"
            chai.request(app.app)
                .get('/notam/')
                .set('Accept', 'application/json')
                .query({polygon: polygon, date:date}) 
                .set('auth', token)
                .then(res => {
                    res.should.have.status(200);
                    res.body.length.should.be.eq(0)
                    done()
                })
                .catch(done);
        });
    
    
    
        
    })
    

 

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

    it("/GET /notam/d7608be2-81a5-4097-456a-b541a1634300 that not exist should get 404 ", function (done) {
        let message_id ="d7608be2-81a5-4097-456a-b541a1634300"
        let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
        chai.request(app.app)
            .get(`/notam/${message_id}`)
            .set('Accept', 'application/json')
            .set('auth', token)
            .then(res => {
                res.should.have.status(404);
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


    it("/POST /notam/ should NOT insert a notam with bad parameters", function (done) {
        // let message_id ="f2308be3-80a5-4247-964a-b541a1634331"
        let poly  = {  "BadPolygon": [ [ [ -56.17652893066406, -34.895857623250066 ], [ -56.18107795715332, -34.90493843104419 ], [ -56.17069244384765, -34.909091334089794 ], [ -56.164255142211914, -34.90092610489535 ], [ -56.17652893066406, -34.895857623250066 ] ] ] }
        let notam1  = {
            text : "For test",
            geography: poly,
            effective_time_begin: "202",
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
                res.should.have.status(400);
               
                done()
            })
            .catch(function(error){
                console.log(error)
                done(error)
            });
    });





});