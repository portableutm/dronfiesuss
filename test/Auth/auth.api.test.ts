let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { TEST_TIMEOUT } from "../conf"; 
import { app, initAsync } from "../../src/index";

describe(' >>> Auth test <<< ', function () {
    this.timeout(TEST_TIMEOUT);


    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            .then((function(application){
                done()
            }))
            .catch(done)
    })

    it("should get 401 when fetch protected resource", function (done) {
        chai.request(app.app)
            .get('/vehicle/')
            .then(res => {
                res.should.have.status(401);
                done()
            })
            .catch(err => {
                console.error(err);
                done(err)
            });
    });


    it("should get token when give correct credentials", function (done) {
        chai.request(app.app)
            .post('/auth/login')
            .send({
                "username": "admin",
                "password": "admin"
            })
            .then(function (res) {
                res.should.have.status(200);
                res.text.should.be.a('string')
                done();
            })
            .catch(done)
    })

    it("should get token as a json when give correct credentials", function (done) {
        chai.request(app.app)
            .post('/auth/login')
            .send({
                "username": "admin",
                "password": "admin",
                "format": "json",
            })
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.be.a('object')
                res.body.token.should.be.a('string')
                done();
            })
            .catch(done)
    })

    it("should get error 401 when give incorrect password", function (done) {
        chai.request(app.app)
            .post('/auth/login')
            .send({
                "username": "admin",
                "password": "incorrect"
            })
            .then(function (res) {
                res.should.have.status(401);
                done();
            })
            .catch(done)
    })

    it("should get error 401 when give incorrect username", function (done) {
        chai.request(app.app)
            .post('/auth/login')
            .send({
                "username": "asdfasdfknlasdflkn",
                "password": "incorrect"
            })
            .then(function (res) {
                res.should.have.status(401);
                done();
            })
            .catch(done)
    })

    it("should get data from api when use token", function (done) {
        chai.request(app.app)
            .post('/auth/login')
            .send({
                "username": "admin",
                "password": "admin"
            })
            .then(function (res) {
                res.should.have.status(200);
                res.text.should.be.a('string')
                let token = res.text
                chai.request(app.app)
                    .get('/vehicle/')
                    .set('auth', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
            })
            .catch(done)
    })

});