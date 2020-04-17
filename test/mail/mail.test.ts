let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
// import { main } from "../../src/services/mailService";
import { sendMail, verifyServer, sendTestMail } from "../../src/services/mailService";

// import { app, init, initAsync } from "../../src/index";

describe('>>> Cron test <<<', function () {

    // before(async () => {
    //     await initAsync()
    // })

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

        }
    })


});