
let chai = require('chai');
let chaiHttp = require('chai-http');

// const io = require('socket.io-client');
// or with import syntax
import * as io from 'socket.io-client'


// Configure chai
chai.use(chaiHttp);
chai.should();

import App from "../../src/app"
import { app, initAsync } from "../../src/index";

import { getToken } from "../../src/services/tokenService";
import { Role } from "../../src/entities/User";
import { Operations } from "../../src/data/operations_data";
import { OperationState, Operation } from "../../src/entities/Operation";
import { TEST_TIMEOUT } from "../conf";

describe('>>> Socket io <<< ', function () {

    let API = "http://localhost:3000/"
    // let app :App
    let socket : SocketIOClient.Socket
    this.timeout(TEST_TIMEOUT);

    before(function (done) {
        initAsync()
            .then(function(application:App){
                // app = application
                app.listen(()=>{
                    console.log("><>< FINISH initAsync ><><")
                    done()
                });
            })
            .catch(function(error){
                done(error)
            })
        
    })

    after(function(done){
        this.timeout(TEST_TIMEOUT);

        console.log("** After ** ")
        try {
            socket.close()
            app.stop(function(){
                console.log("callback app close")
                done()
            })
        }
        catch(error){
            console.log("error")
            done(error)
        }
    })

    /**
     * Test if get position info when utm receibe a new position
     */
    it("New position async ", function (done) {

         socket = io(API, {
            query: {
                // token: token,
                bypass: "a"
            },
            
            // transports: ['websocket']
        });
        // socket.emit("chat message", {data:"data"})
        /* Initialize sockets */
        socket.on('new-position', function (info) {
            console.log(`TesT: new position ${JSON.stringify(info)}`)
            done()
        });

        // socket.on('chat message', function (info) {
        //     console.log(`TesT: new message ${JSON.stringify(info)}`)
        // });

        let token = getToken('admin@dronfies.com', 'admin', Role.ADMIN)
        // code copy from position.api.test.ts :: "should insert a new position in operation"
        let positionToInsert = {
            "altitude_gps": 30,
            "location": {
                "type": "Point",
                "coordinates": [
                    -56.15389108657837,
                    -34.90865141786639
                ]
            },
            "time_sent": "2019-12-11T19:59:10.000Z",
            "gufi": "f7891e78-9bb4-431d-94d3-1a506910c254",
            "heading": 160
        }
        chai.request(app.app)
            .post('/position')
            .set('auth', token)
            .send(positionToInsert)
            .then(function (res) {
                res.should.have.status(200);
                res.body.should.have.property('id');
            })
            .catch(done);
    });

});

