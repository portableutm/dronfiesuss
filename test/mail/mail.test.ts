let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();

import { sendMail, verifyServer, sendTestMail } from "../../src/services/mailService";
import { TEST_TIMEOUT } from "../conf";
import {  } from "../../src/restControllers/MailController";


describe('>>> Mail test <<<', function () {
    this.timeout(TEST_TIMEOUT);

    it("should have no error", function (done) {

        let error: any = verifyServer()
        done(error)

    })

    it("should send mail", function (done) {

        try {
            sendTestMail().then(i => {
                console.log(i)
                done()
            })
            .catch(done)
        } catch (error) {
            console.error("Dio un eerorcito")
            done(error)
        }
    })

    it("should send pending mail", function (done) {

        try {
            sendTestMail().then(i => {
                console.log(i)
                done()
            })
            .catch(done)
        } catch (error) {
            console.error("Dio un eerorcito")
            done(error)
        }
    })


});