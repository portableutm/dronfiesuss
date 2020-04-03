let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { VehicleDao } from "../../src/daos/VehicleDao";

import { app, init, initAsync } from "../../src/index";

describe(' >>> Auth test <<< ', function () {

    before(async () => {
        await initAsync()
    })

    it("should get 403 when fetch protected resource", async () => {
        chai.request(app.app)
        .get('/vehicle/')
        .end((err, res) => {
            res.should.have.status(401);
        });
    });

    // it("should get 403 when fetch protected resource", (done) => {
    //     chai.request(app.app)
    //         .get('/vehicle/')
    //         .end((err, res) => {
    //             res.should.have.status(401);
    //             // res.body.should.be.a('array')
    //             done();

    //         });
    // })

    it("should get token when give correct credentials", async () => {
        // it("should get token when give correct credentials", (done) => {
        chai.request(app.app)
            .post('/auth/login')
            .send({
                "username": "User_1",
                "password": "User_1"
            })
            .end((err, res) => {
                console.log(`token::${JSON.stringify(res.text)}, error:${err}`)
                res.should.have.status(200);
                res.text.should.be.a('string')
                // done();
            });
    })
    it("should get error 401 when give incorrect credentials", async () => {
        // it("should get error 401 when give incorrect credentials", (done) => {
        chai.request(app.app)
            .post('/auth/login')
            .send({
                "username": "User_1",
                "password": "User_1_Incorrect"
            })
            .end((err, res) => {
                res.should.have.status(401);
                // res.body.should.be.a('array')
                // res.body.length.should.be.gt(5)
                // done();

            });
    })

    it("should get data from api when use token", async () => {
        // it("should get data from api when use token", (done) => {
        chai.request(app.app)
            .post('/auth/login')
            .send({
                "username": "User_1",
                "password": "User_1"
            })
            .end((err, res) => {
                console.log(`token::${JSON.stringify(res.text)}, error:${err}`)
                res.should.have.status(200);
                res.text.should.be.a('string')
                let token = res.text
                chai.request(app.app)
                    .get('/vehicle/')
                    .set('auth', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        // res.body.should.be.a('array')
                        // done();

                    });
                // done();
            });
    })

});