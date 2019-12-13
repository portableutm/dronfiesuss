import "reflect-metadata";
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
const app = new App(controllers, 3000, "dev");

app.listen();