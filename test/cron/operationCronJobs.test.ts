let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { OperationDao } from "../../src/daos/OperationDaos";
import { UASVolumeReservationDao } from "../../src/daos/UASVolumeReservationDao";
import { UASVolumeReservation, UASVolumeReservationCause, UASVolumeReservationPermitedUas, UASVolumeReservationRequiredSupport, UASVolumeReservationType } from "../../src/entities/UASVolumeReservation";

import { app, initAsync } from "../../src/index";

import { getNow, fakeTime } from "../../src/services/dateTimeService";
import { TEST_TIMEOUT } from "../conf";
import { processOperations } from "../../src/services/operationCronJobs";
import { OperationState, Operation } from "../../src/entities/Operation";
import { deepCopy } from "../../src/utils/entitiesUtils";
import { Operations } from "../../src/data/operations_data";
import { Users } from "../../src/data/users_data";
import { Polygon } from "geojson";


const userSmtp = "prueba@prueba.com"
const passSmtp = "prueba"

describe('>>> Cron test <<<', function () {

    let operationToRemove = []

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
        this.timeout(TEST_TIMEOUT);
        // console.log(" ---- Removing new ops ---- ")
        let dao = new OperationDao();
        let operationPromises = operationToRemove.map(function (op) {
            return dao.removeOperation(op)
        })
        Promise.all(operationPromises)
            .then(values => {
                // console.log(values); // [3, 1337, "foo"] 
                // console.log(" ---- Removing new ops ---- ")
                done()
            })
            .catch(done)

    })


    it("Should pass a operation from proposed to closed because there are an other operation", function (done) {
        this.timeout(20000);
        let dao = new OperationDao();
        // dao.all().then(function (ops) {
        //     ops.forEach(op => {
        //         console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)
        //     });
        // console.log(` ------- Date is:: ${getNow()}`)
        fakeTime("2019-12-11T20:20:10.000Z")
        processOperations().then(function () {
            setTimeout(async function () {
                // console.log(` ------- Date is:: ${getNow()}`)
                dao.all().then(function (processOps) {
                    processOps.forEach(op => {
                        // console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)
                        if (op.gufi == "a20ef8d5-506d-4f54-a981-874f6c8bd4de") {
                            op.state.should.equal(OperationState.ACTIVATED)
                        }
                        if (op.gufi == "b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63") {
                            op.state.should.equal(OperationState.NOT_ACCEPTED)
                        }
                        if (op.gufi == "ff4b6505-c282-42b1-b013-66f02137f5d5") {
                            op.state.should.equal(OperationState.ACTIVATED)
                        }
                        if (op.gufi == "f7891e78-9bb4-431d-94d3-1a506910c254") {
                            op.state.should.equal(OperationState.ACTIVATED)
                        }
                    });
                    done()
                })
                    .catch(done)
            }, 1000)

        })
            .catch(done)
        // })
        //     .catch(done)




    })

    it("Should pass 3 operations to Closed", function (done) {
        this.timeout(20000);
        let dao = new OperationDao();
        console.log(` ------- Date is:: ${getNow()}`)
        fakeTime("2019-12-11T21:20:10.000Z")
        processOperations().then(function () {
            setTimeout(async function () {
                // console.log(` ------- Date is:: ${getNow()}`)
                dao.all().then(function (processOps) {
                    processOps.forEach(op => {
                        // console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)
                        if (op.gufi == "a20ef8d5-506d-4f54-a981-874f6c8bd4de") {
                            op.state.should.equal(OperationState.CLOSED)
                        }
                        if (op.gufi == "b92c7431-13c4-4c6c-9b4a-1c3c8eec8c63") {
                            op.state.should.equal(OperationState.NOT_ACCEPTED)
                        }
                        if (op.gufi == "ff4b6505-c282-42b1-b013-66f02137f5d5") {
                            op.state.should.equal(OperationState.CLOSED)
                        }
                        if (op.gufi == "f7891e78-9bb4-431d-94d3-1a506910c254") {
                            op.state.should.equal(OperationState.CLOSED)
                        }
                    });
                    done()
                })
                    .catch(done)
            }, 1000)

        })
            .catch(done)
    })

    it("Should pass the new op from rouge to closed", function (done) {
        this.timeout(20000);

        let op = deepCopy(Operations[0])
        delete op.gufi
        op.operation_volumes[0].min_altitude = -500
        op.flight_comments = "For automate Testing operation "
        op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.138935, -34.913103], [-56.142712, -34.920141], [-56.130352, -34.91986], [-56.13018, -34.915919], [-56.138935, -34.913103]]] }
        op.state = OperationState.ROGUE
        let dao = new OperationDao();

        dao.save(op).then(function (op: Operation) {
            operationToRemove.push(op)
            // console.log(` ------- Date is:: ${getNow()}`)
            fakeTime("2019-12-11T21:20:10.000Z")
            processOperations().then(function () {
                setTimeout(async function () {
                    // console.log(` ------- Date is:: ${getNow()}`)
                    // console.log(op)
                    let newOp = await dao.one(op.gufi)
                    newOp.state.should.equal(OperationState.CLOSED)
                    done()
                }, 1000)

            })
                .catch(done)
        }).catch(done)

    })


    it("Should pass the new op from PROPOSED to PENDING because intersect with a restricted flight volume", function (done) {
        this.timeout(20000);

        let op = deepCopy(Operations[0])
        op.owner = Users[0]
        op.creator = Users[1]

        delete op.gufi
        op.name = "Testeando el envio de emails?"
        op.operation_volumes[0].min_altitude = -20
        op.operation_volumes[0].max_altitude = 40
        op.flight_comments = "For test restricted flight volume "
        op.operation_volumes[0].operation_geography = { "type": "Polygon", "coordinates": [[[-56.074905, -34.846212], [-56.08057, -34.867905], [-56.033192, -34.852411], [-56.061516, -34.8379], [-56.074905, -34.846212]]] }
        op.state = OperationState.PROPOSED
        // console.log(`********\n${JSON.stringify(op,null,2)}\n********`)
        let dao = new OperationDao();

        dao.save(op).then(function (op: Operation) {
            operationToRemove.push(op)
            // console.log(`Esto anda? guardo en bbdd`)
            processOperations().then(function () {
                // console.log(`**** Processss the op ${op.gufi}`)
                setTimeout(async function () {
                    // console.log(`**** Ya paso tiempo ${op.gufi}`)
                    let newOp = await dao.one(op.gufi)
                    // let operationIntersections = await newOp.operation_inserctions
                    // console.log(`Intersections:: ${JSON.stringify(operationIntersections)}`)
                    newOp.state.should.equal(OperationState.PENDING)
                    done()
                }, 1000)
            }).catch(done)
        }).catch(done)
    })

    it.only("should pass a operation to not accepted because the operation intersect with an uvr", function (done) {
        this.timeout(6000);

        let uvrPoly: Polygon = { "type": "Polygon", "coordinates": [[[-54.156761169433594, -34.65928102289186], [-54.158692359924316, -34.661681384600065], [-54.15358543395996, -34.66159313723899], [-54.15328502655029, -34.65982817028159], [-54.15478706359863, -34.65820436748019], [-54.156761169433594, -34.65928102289186]]] }
        let uvr: UASVolumeReservation = {
            "uss_name": null,
            "type": UASVolumeReservationType.DYNAMIC_RESTRICTION,
            "permitted_uas": [
                // "PART_107"
                UASVolumeReservationPermitedUas.PART_107
            ],
            "required_support": [
                UASVolumeReservationRequiredSupport.ENHANCED_SAFE_LANDING
            ],
            "cause": UASVolumeReservationCause.MUNICIPALITY,
            "geography": uvrPoly, //{"type": "Polygon","coordinates": [  [    [      -56.159834861755364,      -34.91795954238727    ],    [      -56.16240978240967,      -34.92221734956747    ],    [      -56.15567207336426,      -34.922569224576016    ],    [      -56.15395545959473,      -34.920141256305946    ],    [      -56.159834861755364,      -34.91795954238727    ]  ]]},
            "effective_time_begin": "2020-03-11T14:00:00.000Z",
            "effective_time_end": "2020-03-11T15:00:00.000Z",
            "actual_time_end": null,
            "min_altitude": 20,
            "max_altitude": 50,
            "reason": "uasVolumeReservation.REASON"
        }
        let uvrDao = new UASVolumeReservationDao()
        uvrDao.save(uvr).then(function (uvr) {
            let op = deepCopy(Operations[0])
            op.owner = Users[1]
            op.creator = Users[1]
            delete op.gufi
            op.name = "pass a operation to not accepted intersect with uvr"
            op.operation_volumes[0].min_altitude = -20
            op.operation_volumes[0].max_altitude = 40
            op.operation_volumes[0].effective_time_begin = "2020-03-11T14:30:00.000Z",
            op.operation_volumes[0].effective_time_end = "2020-03-11T15:30:00.000Z",
            op.flight_comments = "For test restricted flight volume "
            let opPoly = { "type": "Polygon", "coordinates": [[[-54.1580057144165, -34.65785136266103], [-54.1556453704834, -34.660798906760135], [-54.15380001068115, -34.66078125710747], [-54.15279150009155, -34.65795726426466], [-54.153714179992676, -34.65594511065539], [-54.1580057144165, -34.65785136266103]]] }
            op.operation_volumes[0].operation_geography = opPoly
            op.state = OperationState.PROPOSED

            let dao = new OperationDao();
            dao.save(op).then(function (op: Operation) {
                operationToRemove.push(op)
                processOperations().then(function () {
                    setTimeout(async function () {
                        let newOp = await dao.one(op.gufi)
                        // console.log(`OP:${JSON.stringify(newOp, null, 2)}`)
                        newOp.state.should.equal(OperationState.NOT_ACCEPTED)
                        newOp.flight_comments.should.equal("UVR")

                        chai.request('http://localhost:1080')
                            .get(`/api/emails?to=${op.owner.email}`)
                            .auth(userSmtp, passSmtp)
                            .then(res => {
                                res.should.have.status(200);
                                res.body.should.be.a('array');
                                let mail = res.body[0]
                                // console.log(`Mail: ${JSON.stringify(mail, null, 2)} `)
                                mail.subject.should.include('Informaci');
                                mail.html.should.include('Zona 1');
                                mail.html.should.include(`uvr/${uvr.message_id}`);
                                done()
                            })
                            .catch(done)
                        // done()
                    }, 2000)
                }).catch(done)
            }).catch(done)

        }).catch(done)
    })




    //     it("Should pass a operation from proposed to closed because there are an other operation", async function(){
    //         let dao = new OperationDao();
    //         let ops = await dao.all()
    //         ops.forEach(op => {
    //             console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)

    //         });
    //         fakeTime("2019-12-11T20:20:10.000Z")
    //         await processOperations();
    //         setTimeout(async function(){
    //             let processOps = await dao.all()
    //             processOps.forEach(op => {
    //                 console.log(`${op.gufi}) ${op.flight_comments} :: ${op.state} -> ${op.operation_volumes[0].effective_time_begin}`)
    //             });
    //         }, 2000)

    // })
    // it("Should pass a operation from proposed to closed because there are an uvr", function(done){

    // })
    // it("...")


});