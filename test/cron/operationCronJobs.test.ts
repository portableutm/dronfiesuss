let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { OperationDao } from "../../src/daos/OperationDaos";

import { app, initAsync } from "../../src/index";
import { getNow, fakeTime } from "../../src/services/dateTimeService";
import { TEST_TIMEOUT } from "../conf";
import { processOperations } from "../../src/services/operationCronJobs";
import { OperationState, Operation } from "../../src/entities/Operation";
import { deepCopy } from "../../src/utils/entitiesUtils";
import { Operations } from "../../src/data/operations_data";
import { Users } from "../../src/data/users_data";

describe('>>> Cron test <<<', function () {

    let operationToRemove = []

    before(function (done) {
        this.timeout(TEST_TIMEOUT);

        initAsync()
            // .then(done)
            .then((function(application){
                done()
            }))
            .catch(done)
    })

    after(function (done) {
        this.timeout(TEST_TIMEOUT);
        // console.log(" ---- Removing new ops ---- ")
        let dao = new OperationDao();
        let operationPromises = operationToRemove.map(function(op){
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
        op.operation_volumes[0].operation_geography = {"type":"Polygon","coordinates":[[[-56.138935,-34.913103],[-56.142712,-34.920141],[-56.130352,-34.91986],[-56.13018,-34.915919],[-56.138935,-34.913103]]]}
        op.state = OperationState.ROGUE
        let dao = new OperationDao();

        dao.save(op).then(function (op:Operation) {
            operationToRemove.push(op)
            console.log(` ------- Date is:: ${getNow()}`)
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
        op.operation_volumes[0].operation_geography = {"type":"Polygon","coordinates":[[[-56.074905,-34.846212],[-56.08057,-34.867905],[-56.033192,-34.852411],[-56.061516,-34.8379],[-56.074905,-34.846212]]]}
        op.state = OperationState.PROPOSED
        console.log(`********\n${JSON.stringify(op,null,2)}\n********`)
        let dao = new OperationDao();

        dao.save(op).then(function (op:Operation) {
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