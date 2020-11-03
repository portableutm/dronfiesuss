let chai = require('chai');
let chaiHttp = require('chai-http');
var assert = chai.assert;

chai.use(chaiHttp);
chai.should();

import { UserDao } from "../../src/daos/UserDaos";
import { app, initAsync } from "../../src/index";
import { User, Role } from "../../src/entities/User";

import { getToken } from "../../src/services/tokenService";
import { Status, UserStatus } from "../../src/entities/UserStatus";

import { TEST_TIMEOUT } from "../conf";
import { DinaciaUser } from "../../src/entities/DinaciaUser";
import { DinaciaCompany } from "../../src/entities/DinaciaCompany";

describe('>>> User rest controller test <<<', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            .then((function (application) {
                done()
            }))
            .catch(done)
    })

    it("POST /user Should create a new user", function (done) {
        let dao = new UserDao()
        dao.all().then(function (users) {
            let CountPreInsert = users.length
            let user: User = {
                username: "UserToInsertDinacia",
                email: `userToInsert@dronfies.com`,
                firstName: `Algun`,
                lastName: `Nombre`,
                password: `password`,
                role: Role.ADMIN
            }

            let dinaciaUser = new DinaciaUser()
            dinaciaUser.cellphone = "099909090"
            dinaciaUser.address = "Av siempre viva 1234"
            dinaciaUser.nationality = "UY"
            dinaciaUser.document_number = "12345678"
            dinaciaUser.phone = "24004040"
            dinaciaUser.document_type = "Cedula"

            let dinacia_company = new DinaciaCompany()
            dinacia_company.RUT = "1234567890"
            dinacia_company.domicilio = "Av De Los Caminos 9876"
            dinacia_company.nombre_comercial = "Los nombres comerciales"
            dinacia_company.razon_social = "Los Comerciales SRL"
            dinacia_company.telefono = "25005050"

            dinaciaUser.dinacia_company = dinacia_company
            user.dinacia_user = dinaciaUser

            chai.request(app.app)
                .post('/user')
                .set('bypass', 'a')
                .set('Accept', 'application/json')
                .send(user)
                .then(res => {
                    console.log(JSON.stringify(res.body, null, 2))
                    res.body.should.have.property('username').equal(user.username);
                    res.body.should.have.property('email').equal(user.email);
                    res.body.should.have.property('firstName').equal(user.firstName);
                    res.body.should.have.property('lastName').equal(user.lastName);
                    res.body.should.have.property('role').equal(user.role);
                    res.body.should.have.property('dinacia_user').deep.include(dinaciaUser)
                    res.body.dinacia_user.should.have.property('dinacia_company').deep.include(dinacia_company)

                    dao.all().then(function (newUsers) {
                        assert.equal(newUsers.length, CountPreInsert + 1)
                        dao.remove(user.username).then(() => { done() }).catch(done)
                    }).catch(err => {
                        done(err);
                    });

                })
                .catch(err => {
                    // console.error(err);
                    done(err);
                });

        })
    });


    // it("POST /user Should create a new user (test bug)", function (done) {
    //     let dao = new UserDao()
    //     dao.all().then(function (users) {
    //         let CountPreInsert = users.length
    //         // let userStatus : UserStatus = 
    //         let status = new UserStatus()
    //         status.status = Status.CONFIRMED
    //         status.token = ""

    //         let user : User = {
    //             username: "testBug",
    //             email: `testBug@dronfies.com`,
    //             firstName: `Algun`,
    //             lastName: `Nombre`,
    //             password: `password`,
    //             role: Role.ADMIN,
    //             status: status
    //         }

    //         chai.request(app.app)
    //             .post('/user')
    //             .set('bypass', 'a')
    //             .set('Accept', 'application/json')
    //             .send(user)
    //             .then(res => {
    //                 // console.log(res.body)
    //                 res.body.should.have.property('username').equal(user.username);
    //                 res.body.should.have.property('email').equal(user.email);
    //                 res.body.should.have.property('firstName').equal(user.firstName);
    //                 res.body.should.have.property('lastName').equal(user.lastName);
    //                 res.body.should.have.property('role').equal(user.role);
    //                 chai.request(app.app)
    //                     .post('/auth/login')
    //                     .send({
    //                         "username": user.username,
    //                         "password": user.password
    //                     })
    //                     .then(function (res) {
    //                         res.should.have.status(200);
    //                         res.text.should.be.a('string')
    //                         done();
    //                     })
    //                     .catch(done)
    //                 // dao.all().then(function (newUsers) {
    //                 //     assert.equal(newUsers.length, CountPreInsert + 1)
    //                 //     done();
    //                 // }).catch(err => {
    //                 //     console.error(err);
    //                 //     done(err);
    //                 // });
    //             })
    //             .catch(err => {
    //                 // console.error(err);
    //                 done(err);
    //             });
    //     })
    // });

    // it("POST /user Should not create a new user with a non ADMIN user", function (done) {
    //     let dao = new UserDao()
    //     dao.all().then(function (users) {
    //         let CountPreInsert = users.length
    //         let user: User = {
    //             username: "AnOtherUserToInsert",
    //             email: `anotherusertoinsert@dronfies.com`,
    //             firstName: `Algun`,
    //             lastName: `Nombre`,
    //             password: `password`,
    //             role: Role.ADMIN
    //         }
    //         let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)

    //         chai.request(app.app)
    //             .post('/user')
    //             .set('auth', token)
    //             .set('Accept', 'application/json')
    //             .send(user)
    //             .then(res => {
    //                 res.should.have.status(401);
    //                 dao.all().then(function (newUsers) {
    //                     assert.equal(newUsers.length, CountPreInsert)
    //                     done();
    //                 }).catch(err => {
    //                     // console.error(err);
    //                     done(err);
    //                 });

    //             })
    //             .catch(err => {
    //                 // console.error(err);
    //                 done(err);
    //             });

    //     })
    // });

    // it("POST /user Should not create a new user with existing username", function (done) {
    //     let dao = new UserDao()
    //     dao.all().then(function (users) {
    //         let CountPreInsert = users.length
    //         let user: User = {
    //             username: "admin",
    //             email: `userToInsert@dronfies.com`,
    //             firstName: `Otro`,
    //             lastName: `Nombrenuevo`,
    //             password: `password`,
    //             role: Role.PILOT
    //         }

    //         chai.request(app.app)
    //             .post('/user')
    //             .set('bypass', 'a')
    //             .set('Accept', 'application/json')
    //             .send(user)
    //             .then(res => {
    //                 res.should.have.status(400);
    //                 dao.all().then(function (newUsers) {
    //                     assert.equal(newUsers.length, CountPreInsert)
    //                     done();
    //                 }).catch(err => {
    //                     // console.error(err);
    //                     done(err);
    //                 });

    //             })
    //             .catch(err => {
    //                 // console.error(err);
    //                 done(err);
    //             });
    //     })
    // });

    // it("POST /user Should not create a new user with existing email", function (done) {
    //     let dao = new UserDao()
    //     dao.all().then(function (users) {
    //         let CountPreInsert = users.length
    //         let user: User = {
    //             username: "wakawaka",
    //             email: `admin@dronfies.com`,
    //             firstName: `NewName`,
    //             lastName: `NewLastName`,
    //             password: `password`,
    //             role: Role.PILOT
    //         }

    //         chai.request(app.app)
    //             .post('/user')
    //             .set('bypass', 'a')
    //             .set('Accept', 'application/json')
    //             .send(user)
    //             .then(res => {
    //                 res.should.have.status(400);
    //                 dao.all().then(function (newUsers) {
    //                     assert.equal(newUsers.length, CountPreInsert)
    //                     done();
    //                 }).catch(err => {
    //                     // console.error(err);
    //                     done(err);
    //                 });

    //             })
    //             .catch(err => {
    //                 // console.error(err);
    //                 done(err);
    //             });
    //     })
    // });

    // let invalidUsers = [
    //     {
    //         username: "wakawaka",
    //         email: `admindronfies.com`,
    //         firstName: `NewName`,
    //         lastName: `NewLastName`,
    //         password: `password`,
    //         role: Role.PILOT
    //     },
    //     {
    //         username: "",
    //         email: `admin@dronfies.com`,
    //         firstName: `NewName`,
    //         lastName: `NewLastName`,
    //         password: `password`,
    //         role: Role.PILOT
    //     },
    //     {
    //         username: "wakawaka",
    //         email: `admin@dronfies.com`,
    //         firstName: ``,
    //         lastName: `NewLastName`,
    //         password: `password`,
    //         role: Role.PILOT
    //     }, {
    //         username: "wakawaka",
    //         email: `admin@dronfies.com`,
    //         firstName: `NewName`,
    //         lastName: ``,
    //         password: `password`,
    //         role: Role.PILOT
    //     },
    //     {
    //         username: "wakawaka",
    //         email: `admin@dronfies.com`,
    //         firstName: ``,
    //         lastName: ``,
    //         password: `password`,
    //         role: Role.PILOT
    //     },
    //     {
    //         username: "wakawaka",
    //         email: `admindronfies.com`,
    //         firstName: ``,
    //         lastName: ``,
    //         password: `password`,
    //         role: Role.PILOT
    //     },
    //     {
    //         username: "wakawaka",
    //         email: `admindronfies.com`,
    //         // firstName: ``,
    //         lastName: ``,
    //         password: `password`,
    //         role: Role.PILOT
    //     },
    //     {
    //         username: "wakawaka",
    //         email: `admindronfies.com`,
    //         firstName: ``,
    //         // lastName: ``,
    //         password: `password`,
    //         role: Role.PILOT
    //     },
    //     {
    //         username: "wakawaka",
    //         email: `admindronfies.com`,
    //         firstName: ``,
    //         lastName: ``,
    //         password: ``,
    //         role: Role.PILOT
    //     },
    //     {
    //         username: "wakawaka",
    //         email: `admindronfies.com`,
    //         firstName: `12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890`,
    //         lastName: ``,
    //         password: `password`,
    //         role: Role.PILOT
    //     }
    // ]

    // invalidUsers.forEach(user => {
    //     it("POST /user Should not create a new user with invalid fields", function (done) {
    //         let dao = new UserDao()
    //         dao.all().then(function (users) {
    //             let CountPreInsert = users.length

    //             chai.request(app.app)
    //                 .post('/user')
    //                 .set('bypass', 'a')
    //                 .set('Accept', 'application/json')
    //                 .send(user)
    //                 .then(res => {
    //                     res.should.have.status(400);
    //                     dao.all().then(function (newUsers) {
    //                         assert.equal(newUsers.length, CountPreInsert)
    //                         done();
    //                     }).catch(err => {
    //                         // console.error(err);
    //                         done(err);
    //                     });

    //                 })
    //                 .catch(err => {
    //                     // console.error(err);
    //                     done(err);
    //                 });
    //         })
    //     });
    // });

    // it("GET /user/{username} Should get a users", function (done) {
    //     let dao = new UserDao()
    //     dao.all()
    //         .then(function (users) {
    //             let user = users[0]
    //             chai.request(app.app)
    //                 .get(`/user/${user.username}`)
    //                 .set('bypass', 'a')
    //                 .then(res => {
    //                     res.should.have.status(200);
    //                     res.body.should.have.property('username').equal(user.username);
    //                     res.body.should.have.property('email').equal(user.email);
    //                     res.body.should.have.property('firstName').equal(user.firstName);
    //                     res.body.should.have.property('lastName').equal(user.lastName);
    //                     res.body.should.have.property('role').equal(user.role);
    //                     done()

    //                 })
    //                 .catch(err => {
    //                     // console.error(err);
    //                     done(err)
    //                 });
    //         })
    //         .catch(err => {
    //             // console.error(err);
    //             done(err)
    //         });
    // });

    // it("GET /user/{username} Should not get a users with PILOT user", function (done) {
    //     let dao = new UserDao()
    //     let token = getToken('maurine@dronfies.com', 'MaurineFowlie', Role.PILOT)
    //     dao.all()
    //         .then(function (users) {
    //             let user = users[0]
    //             chai.request(app.app)
    //                 .get(`/user/${user.username}`)
    //                 .set('auth', token)
    //                 .then(res => {
    //                     res.should.have.status(401);
    //                     done()

    //                 })
    //                 .catch(err => {
    //                     // console.error(err);
    //                     done(err)
    //                 });
    //         })
    //         .catch(err => {
    //             // console.error(err);
    //             done(err)
    //         });
    // });

    // it("GET /user/notUserName Should resturn STATUS 404", function (done) {
    //     let strangeUserName = "owbfadsobfqoiwabfoqweofboefio"
    //     chai.request(app.app)
    //         .get(`/user/${strangeUserName}`)
    //         .set('bypass', 'a')
    //         .then(res => {
    //             res.should.have.status(404);
    //             done()
    //         })
    //         .catch(err => {
    //             // console.error(err);
    //             done(err)
    //         });

    // });

    // describe("Testing User Status", function () {

    //     it("POST /user/register Should create a new user with status UNCONFIRMED", function (done) {
    //         let dao = new UserDao()
    //         dao.all().then(function (users) {
    //             let CountPreInsert = users.length
    //             let user: User = {
    //                 username: "unconfirmedTestUser",
    //                 email: `info@dronfies.com`,
    //                 firstName: `unconfirmedTestUser`,
    //                 lastName: `unconfirmedTestUser`,
    //                 password: `unconfirmedTestUser`,
    //                 role: Role.PILOT
    //             }

    //             chai.request(app.app)
    //                 .post('/user/register')
    //                 .set('Accept', 'application/json')
    //                 .send(user)
    //                 .then(res => {
    //                     res.should.have.status(200);
    //                     res.body.should.have.property('username').equal(user.username);
    //                     res.body.should.have.property('email').equal(user.email);
    //                     res.body.should.have.property('firstName').equal(user.firstName);
    //                     res.body.should.have.property('lastName').equal(user.lastName);
    //                     res.body.should.have.property('role').equal(Role.PILOT);

    //                     dao.all()
    //                         .then(function (newUsers) {
    //                             assert.equal(newUsers.length, CountPreInsert + 1)
    //                             dao.one(user.username)
    //                                 .then(function (newUser) {
    //                                     // console.log(`>${JSON.stringify(newUser, null, 2)}<`)
    //                                     getUserStatus(newUser)
    //                                         .then(status => {
    //                                             // console.log(status)
    //                                             status.should.have.property("status").equal(Status.UNCONFIRMED)
    //                                             done();
    //                                         }).catch(done)
    //                                 }).catch(done)
    //                         }).catch(done);
    //                 }).catch(done)
    //         }).catch(done)
    //     });

    //     it("POST /user/confirm confirm unconfirmedTestUser", function (done) {
    //         let dao = new UserDao()
    //         let user: User = {
    //             username: "unconfirmedTestUser",
    //             email: `unconfirmedTestUser@dronfies.com`,
    //             firstName: `unconfirmedTestUser`,
    //             lastName: `unconfirmedTestUser`,
    //             password: `unconfirmedTestUser`,
    //             role: Role.PILOT
    //         }

    //         dao.one(user.username)
    //             .then(function (newUser) {
    //                 // console.log(`Get the user to change status ${newUser.username}`)
    //                 getUserStatus(newUser)
    //                     .then(status => {
    //                         // console.log(`Get the status ${JSON.stringify(status)}`)
    //                         status.should.have.property("status").equal(Status.UNCONFIRMED)

    //                         let confirmJson = {
    //                             username: "unconfirmedTestUser",
    //                             token: status.token
    //                         }

    //                         chai.request(app.app)
    //                             .post('/user/confirm')
    //                             .set('Accept', 'application/json')
    //                             .send(confirmJson)
    //                             .then(res => {
    //                                 res.should.have.status(200);
    //                                 res.body.should.have.property('message').equal("Confirmed user");
    //                                 dao.one(user.username)
    //                                     .then(function (newUser) {
    //                                         getUserStatus(newUser)
    //                                             .then(status => {
    //                                                 console.log(`Test ${JSON.stringify(status)}`)
    //                                                 status.should.have.property("status").equal(Status.CONFIRMED)
    //                                                 done();
    //                                             }).catch(done)
    //                                     }).catch(done)
    //                             }).catch(done)
    //                     }).catch(done)
    //             }).catch(done)
    //         });

    // })



});


async function getUserStatus(newUser: User) {
    let status = await newUser.status
    return status;
}