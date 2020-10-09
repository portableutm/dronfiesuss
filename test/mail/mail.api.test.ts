let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();

import { sendMail, verifyServer, sendTestMail } from "../../src/services/mailService";
import { app, initAsync } from "../../src/index";
import { TEST_TIMEOUT } from "../conf";
// import { sendMailPedingOperationFunction } from "../../src/restControllers/MailController";
import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";
import { deepCopy } from "../../src/utils/entitiesUtils";
import { OperationState } from "../../src/entities/Operation";
import { Operations } from "../../src/data/operations_data";
import { OperationDao } from "../../src/daos/OperationDaos";

const userSmtp = "prueba@prueba.com"
const passSmtp = "prueba"

describe('>>> Mail api test <<<', function () {
    before(function (done) {
        this.timeout(TEST_TIMEOUT);
        initAsync()
            // .then(done)
            .then((function (application) {
                done()
            }))
            .catch(done)
    })

    after(function (done) {
        // this.timeout(TEST_TIMEOUT);
        // chai.request('http://localhost:1080')
        //     .delete(`/api/emails`)
        //     .auth(userSmtp, passSmtp)
        //     .then((res) => {
        //         console.log(`Deleting: ${JSON.stringify(res.body)}`)
                done()
        //     })
        //     .catch(done)
    })

    // receiverMail, idOperation, bodyMail
    it("/POST shoud fail because the operation not exists ", function (done) {
        this.timeout(10000);
        const receiverMail = "pendigOperationTest@dronfies.com"
        let mailData = {
            receiverMail: receiverMail,
            gufi: "xxx-Invalid Id operation",
            bodyMail: ""
        }
        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)

        chai.request(app.app)
            .post(`/mail/pending`)
            .set('Accept', 'application/json')
            .set('auth', token)
            .send(mailData)
            .then(res => {
                res.should.have.status(400);
                done()
            })
            .catch(done);
    });

    // it("/POST shoud fail because gufi is not sended ", function (done) {
    //     this.timeout(10000);
    //     const receiverMail = "pendigOperationTest@dronfies.com"
    //     let mailData = {
    //         receiverMail: receiverMail,
    //         bodyMail: ""
    //     }
    //     let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)

    //     chai.request(app.app)
    //         .post(`/mail/pending`)
    //         .set('Accept', 'application/json')
    //         .set('auth', token)
    //         .send(mailData)
    //         .then(res => {
    //             res.should.have.status(400);
    //             done()
    //         })
    //         .catch(done);
    // });

    it("/POST shoud send a mail with operation data ", function (done) {
        this.timeout(10000);

        let op = deepCopy(Operations[0])
        delete op.gufi 

        let newGufi = '89250d79-7442-4e58-a12c-954537bb0820'
        op.gufi = newGufi
        op.name = "Operation for testing mail"
        op.uas_registrations = []
        op.flight_comments = "Operation for testing mail comments "
        op.state = OperationState.PENDING
        // op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.215668, -34.906628], [-56.212749, -34.912751], [-56.207514, -34.910429], [-56.210947, -34.904516], [-56.215668, -34.906628]]] }
        op.operation_volumes[0].operation_geography = {"type": "Polygon","coordinates": [[[-56.060829162597656,-34.84536693184099],[-56.05842590332031,-34.85635499318428],[-56.02375030517578,-34.85663671905172],[-56.03473663330078,-34.84085858477277],[-56.060829162597656,-34.84536693184099]]]}
        

        const opDao = new OperationDao();
        opDao.save(op).then(function (op: any) {

            const receiverMail = "pendigOperationTest@dronfies.com"
            let mailData = {
                receiverMail: receiverMail,
                gufi: newGufi,
                bodyMail: "La operació... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam mi ligula, fringilla nec vulputate eget, fermentum lacinia elit. Ut tincidunt mauris felis, sed volutpat nisi hendrerit quis. Sed maximus justo quis nunc consequat pellentesque. Ut non eros a nulla consequat molestie in a arcu. Curabitur venenatis lectus augue, vel viverra ex pulvinar nec. Nunc vestibulum malesuada ex, et ultrices dui pellentesque nec. Aliquam erat volutpat. Nullam in elit quam. Mauris et erat ullamcorper, imperdiet mi id, facilisis felis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec commodo vitae orci vitae mattis. Proin gravida imperdiet eleifend. Aenean volutpat lacus nec tempor interdum. Maecenas in sapien vel urna efficitur molestie ac at diam. Quisque eu tellus porttitor, eleifend orci vitae, ullamcorper nibh. "
            }
            // console.log(`------- Envíando mail pendiente: ${JSON.stringify(mailData)}`)
            let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)

            chai.request(app.app)
                .post(`/mail/pending`)
                .set('Accept', 'application/json')
                .set('auth', token)
                .send(mailData)
                .then(res => {
                    res.should.have.status(200);
                    // const mission = res.body

                    sleep(1000).then(() => {
                        chai.request('http://localhost:1080')
                            // /api/emails?from=joe@example.com&to=bob@example.com&since=2017-09-18T12:00:00Z&until=2017-09-19T00:00:00Z
                            .get(`/api/emails?to=${receiverMail}`)
                            .auth(userSmtp, passSmtp)
                            .then(res => {
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                let mail = res.body[0]
                                // console.log(`Mail: ${JSON.stringify(mail, null, 2)} - subject:${mail.subject}`)
                                mail.subject.should.include('Informaci');
                                opDao.removeOperation(op).then(()=>{done()}).catch((error)=>{console.error(error);done(error)})
                                // done()
                            })
                            .catch(done)
                    })
                })
                .catch(done);
        })
    })
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}