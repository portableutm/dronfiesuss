let chai = require('chai');
let chaiHttp = require('chai-http');


// Configure chai
chai.use(chaiHttp);
chai.should();

import { UserDao } from "../../src/daos/UserDaos";
import { app, init, initAsync } from "../../src/index";

import {User, Role} from "../../src/entities/User";
import { hashPassword } from "../../src/services/encrypter";

describe('>>> User test <<<', function () {

    before(async () => {
        await initAsync()
    })

    it("Should get all users", async () => {
        chai.request(app.app)
            .get('/user')
            .set('bypass', 'a')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.gt(5)
            });
    });

    it("Should create a new user", async () => {
        let dao = new UserDao()
        let users = await dao.all()
        let CountPreInsert = users.length
        let user : User = {
            username : "UserToInsert",
            email : `userToInsert@dronfies.com`,
            firstName : `Admin`,
            lastName : `Admin`,
            password : hashPassword(`admin`),
            role : Role.ADMIN
        }
        chai.request(app.app)
            .post('/user')
            .set('bypass', 'a')
            .send(user)
            .end(
                async (err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('username');
                    let users = await dao.all()
                    users.length.should.be.gt(CountPreInsert)
                });
    });

    it("Should get a users", async () => {
        let dao = new UserDao()
        let users = await dao.all()
        let user = users[0]
        chai.request(app.app)
            .get(`/user/${user.username}`)
            .set('bypass', 'a')
            .end(
                async (err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('username');
                });
    });


});