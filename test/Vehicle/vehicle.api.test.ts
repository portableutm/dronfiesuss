let chai = require('chai');
let chaiHttp = require('chai-http');

// Configure chai
chai.use(chaiHttp);
chai.should();
import { VehicleDao } from "../../src/daos/VehicleDao";

// import App from "../../src/app";
// const controllers = [];
// const app = new App(controllers, 3000, "test");

import { app, init, initAsync } from "../../src/index";

describe('Vehicle entity', function() {

    before(async ()=>{
        await initAsync()
    })

    it("should get all vehicles record", (done) => {
        // app.printStatus()
        chai.request(app.app)
            .get('/vehicle')
            .end((err, res) => {
                // console.log("Prueba")
                // console.log(res.body)
                res.should.have.status(200);
                res.body.should.be.a('array')
                res.body.length.should.be.gt(5)
                done();
                
             });
    });

    it("should insert a new vehicle", async () => {
        let dao = new VehicleDao()
        let vehicles = await dao.all()
        let vehicleCountPreInsert = vehicles.length
        let vehicleToInsert = {
            "nNumber": "",
            "faaNumber": "faaNumber_81128",
            "vehicleName": "vehicle_name828",
            "manufacturer": "PIXHAWK",
            "model": "model_828",
            "class": "Fixed wing",
            "accessType": "",
            "vehicleTypeId": "",
            "org-uuid": "",
            "registeredBy":"User_1"
        }
        chai.request(app.app)
            .post('/vehicle')
            .send(vehicleToInsert)
            .end(
                async (err, res) => {
                // console.log(res.body)
                res.should.have.status(200);
                res.body.should.have.property('uvin');
                let vehicles = await dao.all()
                vehicles.length.should.be.gt(vehicleCountPreInsert )
             });
    });

    it("should get a vehicle", async () => {
        let dao = new VehicleDao()
        let vehicles = await dao.all()
        let vehicle = vehicles[0]
        chai.request(app.app)
            .get(`/vehicle/${vehicle.uvin}`)
            // .query({id: vehicle.uvin})
            .end(
                async (err, res) => {
                console.log(res.body)
                res.should.have.status(200);
                res.body.should.have.property('uvin');
                // let vehicles = await dao.all()
                // vehicles.length.should.be.gt(vehicleCountPreInsert )
             });
    });

  
});