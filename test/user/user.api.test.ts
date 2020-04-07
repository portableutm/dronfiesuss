let chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;

chai.use(chaiHttp);
chai.should();

import { UserDao } from "../../src/daos/UserDaos";
import { app, init, initAsync } from "../../src/index";

import { User, Role } from "../../src/entities/User";
import { hashPassword } from "../../src/services/encrypter";

import * as request from 'supertest';

describe('>>> User rest controller test <<<', function () {

    before(function (done) {
        initAsync()
            .then(done)
            .catch(done)
    })

    it("GET /user Should get all users", (done) => {
        // it("Should get all users", (done) => {
        request(app.app)
            .get('/user')
            .set('bypass', 'a')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(function (res) {
                res.body.length.should.be.eq(11)
            })
            .expect(200, done)
    });

    it("GET /user Should get all users", (done) => {
        chai.request(app.app)
            .get('/user')
            .set('bypass', 'a')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.gt(5)
                res.body.length.should.be.eq(11)
                done();
            });
    });

    it("POST /user Should create a new user", function (done) {
        let dao = new UserDao()
        dao.all().then(function (users) {
            let CountPreInsert = users.length
            let user: User = {
                username: "UserToInsert",
                email: `userToInsert@dronfies.com`,
                firstName: `Admin`,
                lastName: `Admin`,
                password: hashPassword(`admin`),
                role: Role.ADMIN
            }

            request(app.app)
                .post('/user')
                .set('bypass', 'a')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send(user)
                .expect(function (res) {
                    res.body.should.have.property('username').equal(user.username);
                    res.body.should.have.property('email').equal(user.email);
                    res.body.should.have.property('firstName').equal(user.firstName);
                    res.body.should.have.property('lastName').equal(user.lastName);
                    res.body.should.have.property('role').equal(user.role);

                })
                .then(res => {
                    dao.all().then(function (newUsers) {
                        assert.equal(newUsers.length, CountPreInsert+1)
                        done();
                    }).catch(err => {
                        console.error(err);
                        done(err);
                    });

                })
                .catch(err => {
                    console.error(err);
                    done(err);
                });

        })
    });

    it("GET /user/{username} Should get a users", function (done) {
        let dao = new UserDao()
        dao.all()
            .then(function (users) {
                let user = users[0]
                chai.request(app.app)
                    .get(`/user/${user.username}`)
                    .set('bypass', 'a')
                    .then(res => {
                        res.should.have.status(200);
                        res.body.should.have.property('username').equal(user.username);
                        res.body.should.have.property('email').equal(user.email);
                        res.body.should.have.property('firstName').equal(user.firstName);
                        res.body.should.have.property('lastName').equal(user.lastName);
                        res.body.should.have.property('role').equal(user.role);
                        done()

                    })
                    .catch(err => {
                        console.error(err);
                        done(err)
                    });
            })
            .catch(err => {
                console.error(err);
                done(err)
            });

    });

    it("GET /user/notUserName Should resturn STATUS 404", function (done) {
        let strangeUserName = "owbfadsobfqoiwabfoqweofboefio"
        chai.request(app.app)
            .get(`/user/${strangeUserName}`)
            .set('bypass', 'a')
            .then(res => {
                res.should.have.status(404);
                done()
            })
            .catch(err => {
                console.error(err);
                done(err)
            });

        // let dao = new UserDao()
        // dao.all()
        //     .then(function (users) {
        //         let user = users[0]

        //     })
        //     .catch(err => {
        //         console.error(err);
        //         done(err)
        //     });

    });


});