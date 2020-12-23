let chai = require('chai');
let chaiHttp = require('chai-http');
let fs = require('fs');
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

describe.only('>>> DINACIA User rest controller test <<<', function () {

    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            .then((function (application) {
                done()
            }))
            .catch(done)
    })

    it("POST /user Should create a new user dinacia data", function (done) {
        let dao = new UserDao()
        dao.all().then(function (users) {
            let CountPreInsert = users.length
            let user: User = {
                username: "UserToInsertDinaciaNuevo",
                email: `userToInsertDinacia@dronfies.com`,
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
                    // console.log(JSON.stringify(res.body, null, 2))
                    delete res.body.dinacia_user.id
                    delete res.body.dinacia_user.dinacia_company.id
                    res.should.have.status(200);

                    res.body.should.have.property('username').equal(user.username);
                    res.body.should.have.property('email').equal(user.email);
                    res.body.should.have.property('firstName').equal(user.firstName);
                    res.body.should.have.property('lastName').equal(user.lastName);
                    res.body.should.have.property('role').equal(user.role);
                    res.body.should.have.property('dinacia_user').deep.include(dinaciaUser)
                    // res.body.dinacia_user.should.have.property('dinacia_company').deep.include(dinacia_company)

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

    it("POST /user/register Should registrate a new user dinacia", function (done) {
        let dao = new UserDao()
        dao.all().then(function (users) {
            let CountPreInsert = users.length
            let user: any = {
                username: "UserToInsertDinacia2",
                email: `userToInsertDinacia2@dronfies.com`,
                firstName: `Algun`,
                lastName: `Nombre`,
                password: `password`,
            }

            let dinaciaUser = new DinaciaUser()
            dinaciaUser.cellphone = "099909090"
            dinaciaUser.address = "Av siempre viva 1234"
            dinaciaUser.nationality = "UY"
            dinaciaUser.document_number = "12345678"
            dinaciaUser.phone = "24004040"
            dinaciaUser.document_type = "Cedula"

            user.dinacia_user_str = JSON.stringify(dinaciaUser)

            chai.request(app.app)
                .post('/user/register')
                .set('Accept', 'multipart/form-data')

                .field('username', user.username)
                .field('email', user.email)
                .field('firstName', user.firstName)
                .field('lastName', user.lastName)
                .field('password', user.password)
                .field('dinacia_user_str', JSON.stringify(dinaciaUser))

                .attach('document_file', fs.readFileSync(__dirname + '/ci.png'), 'ci.png')
                .attach('permit_front_file', fs.readFileSync(__dirname + '/licencia.png'), 'licencia.png')
                .attach('permit_back_file', fs.readFileSync(__dirname + '/licencia_reverso.png'), 'licencia_reverso.png')


                .then(res => {
                    // console.log(`Response:${JSON.stringify(res.body, null, 2)}`)
                    res.should.have.status(200);
                    res.body.should.have.property('username').equal(user.username);
                    res.body.should.have.property('email').equal(user.email);
                    res.body.should.have.property('firstName').equal(user.firstName);
                    res.body.should.have.property('lastName').equal(user.lastName);
                    delete res.body.dinacia_user.id
                    res.body.should.have.property('dinacia_user').deep.include(dinaciaUser)

                    dao.all().then(function (newUsers) {
                        assert.equal(newUsers.length, CountPreInsert + 1)
                        dao.remove(user.username).then(() => { done() }).catch(done)
                    }).catch(err => {
                        done(err);
                    });

                })
                .catch(err => {
                    done(err);
                });

        })
    });

    it("PUT /user/info/:id should update user", function (done) {
        let token = getToken('trula@dronfies.com', 'TrulaRemon', Role.PILOT)
        let username = "TrulaRemon"
        
        let user: any = {
            email: `userToUpdateDinaciaNuevoPrueba@dronfies.com`,
            firstName: `Nuevo nombre`,
            lastName: `Nombre`,
            // password: `password`,
        }

        let dinaciaUser = new DinaciaUser()
        dinaciaUser.cellphone = "099909090"
        dinaciaUser.address = "Av siempre viva 9999"
        dinaciaUser.nationality = "UY"
        dinaciaUser.document_number = "12345678"
        dinaciaUser.phone = "24004040"
        dinaciaUser.document_type = "Cedula"

        user.dinacia_user_str = JSON.stringify(dinaciaUser)


        chai.request(app.app)
            .put(`/user/info/${username}`)
            .set('Accept', 'multipart/form-data')
            .set('auth', token)
            .field('firstName', user.firstName)
            .field('email', user.email)
            .field('lastName', user.lastName)
            .field('dinacia_user_str', JSON.stringify(dinaciaUser))

            .attach('document_file', fs.readFileSync(__dirname + '/ciNueva.png'), 'ciNueva.png')
            // .attach('permit_front_file', fs.readFileSync(__dirname + '/licencia.png'), 'licencia.png')
            // .attach('permit_back_file', fs.readFileSync(__dirname + '/licencia_reverso.png'), 'licencia_reverso.png')


            .then(res => {
                console.log(`Response:${JSON.stringify(res.body, null, 2)}`)
                res.should.have.status(200);
                res.body.should.have.property('username').equal(username);
                res.body.should.have.property('firstName').equal(user.firstName);
                res.body.should.have.property('lastName').equal(user.lastName);
                res.body.should.have.property('email').equal(user.email);
                delete res.body.dinacia_user.id
                res.body.should.have.property('dinacia_user').deep.include(dinaciaUser)
                done()

            })
            .catch(err => {
                done(err);
            });
    });




});


async function getUserStatus(newUser: User) {
    let status = await newUser.status
    return status;
}