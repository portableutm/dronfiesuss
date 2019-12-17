// import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import {User} from "./entities/User";

import { VehicleDao } from "./restControllers/vehicleSimpleDao";
import { VehicleReg } from "./entities/VehicleReg";

import App from "./app";
const controllers = [];
export let app;

if(process.env.NODE_ENV == "dev"){
    console.log("DEV env")
    app = new App(controllers, 3000, "dev");
    app.listen();
} else {
    console.log("Test env")
}
