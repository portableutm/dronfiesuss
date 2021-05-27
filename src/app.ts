import "reflect-metadata";
require('dotenv').config()
import { jwtSecret, cert, key, keyPhrase } from "./config/config";
import * as express from 'express';
import * as path from 'path';
// const path = require('path');
import { Request, Response } from "express";
import { Connection } from 'typeorm';
var cors = require('cors')
var morgan = require('morgan')

import { Server } from "http";
import { Server as HttpsServer, createServer } from "https";
var https = require('https');
import * as fs from "fs";
import * as Io from "socket.io";


import { Routes } from "./routes";
import { initData } from "./databaseInit";
import { createTypeormConn } from "./databaseConfig";

import { authMiddleware } from "./middleware/socketioAuthMiddleware";

import { CronService } from "./services/cronServices";

class App {
    public app: express.Application;
    public port: number;
    public httpPort: number;
    public connection: Connection; // TypeORM connection to the database
    public connectionName: string;
    public io: SocketIO.Server;
    private server: Server;
    private https: HttpsServer;

    public initedDB: boolean = false;
    public initedRest: boolean = false;

    private cronService: CronService;

    constructor(controllers: any[] /*, port: number, connName: string*/, callback?: (param?: any) => void) {
        process.env.TZ = "Etc/GMT"
        this.app = express();


        if ((process.env.PORT == undefined) || (process.env.DATABASE_CONNECTION_NAME == undefined)) {
            throw `You must define PORT and DATABASE_CONNECTION_NAME on .env file`
        }

        this.port = Number.parseInt(process.env.PORT) //|| port;
        this.connectionName = process.env.DATABASE_CONNECTION_NAME //|| connName;

        console.log(`Constructor-> port:${this.port} connName:${this.connectionName}`)

        this.initializeMiddlewares();
        this.initializeModels(callback ? callback : () => { });

    }

    private async initializeModels(callback: () => any) {

        console.log(`Connection name #${this.connectionName}#!`)
        const connection: Connection = await createTypeormConn(this.connectionName);
        if (connection === undefined) {
            throw new Error('Error connecting to database');
        } // In case the connection failed, the app stops.
        console.log(`Start synchronize`)
        await connection.synchronize(); // this updates the database schema to match the models' definitions
        console.log(`Finish synchronize`)

        this.connection = connection; // Store the connection object in the class instance.

        //Pegar aca
        await initData(connection, () => {
            this.initedDB = true;
            try {
                console.log(`process.env.NODE_ENV:${process.env.NODE_ENV}`)
                if (process.env.NODE_ENV != "test") {
                    this.cronService = new CronService()
                }
            } catch (error) {
                console.error(`Error while starting cronService ${error}`)
            }
            callback()
        })
    }

    // Here we can add all the global middlewares for our application. (Those that will work across every contoller)
    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors({
            exposedHeaders: ['token'],
        }))



        console.log(`Path to save upload files::${path.join(__dirname, 'uploads')}`)
        this.app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

        // this.app.use(morgan('dev'))

        // this.app.use(function (req, res, next) {
        //     console.log(`body: ${JSON.stringify(req.body)}`)
        //     console.log(`query: ${JSON.stringify(req.query)}`)
        //     console.log(`params: ${JSON.stringify(req.params)}`)
        //     next()
        // })

        Routes.forEach(route => {
            (this.app as any)[route.method](route.route, route.middlewares ? route.middlewares : (req, res, next) => { return next() }, (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    // console.log(result)
                    // return result

                    result.
                        then(result => {
                            // console.log(`name ${result.constructor.name}`)
                            if (result.constructor.name === 'Object') {
                                // return result
                                result !== null && result !== undefined ? res.send(result) : undefined
                            }
                            else if (result.constructor.name === 'Array') {
                                result !== null && result !== undefined ? res.send(result) : undefined
                                // return result
                            }
                            else {
                                // result !== null && result !== undefined ? res.send(result) : undefined
                                return result
                            }
                        })
                        .catch(error => console.error(error));


                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            });
        });
    }

    // private initializeControllers(controllers: any[]) {
    //     controllers.forEach((controller) => {
    //         this.app.use('/', controller.router);
    //     });
    // }

    public stop(callback) {
        // console.log("Close io:")
        // this.io.close(function () {
        console.log("Close server:")

        // this.server.close(function (error) {
        //     console.log("server closed" + error)
        //     callback()
        // })

        this.io.close();
        this.server.close();
        delete this.io
        delete this.server
        // delete this.app
        callback()

        // })
    }

    // Boots the application
    public listen(callback?: (param?: any) => void) {
        const port = this.port;

        this.server = new Server(this.app)

        // this.app.use((req, res, next) => {
        //     console.log(`Entrando por http : ${req.get('host')}`)
        //     // The 'x-forwarded-proto' check is for Heroku
        //     if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
        //         return res.redirect('https://' + req.get('host') + req.url);
        //     }
        //     next();
        // })

        this.app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });

        this.app.get('/ops', function (req, res) {
            res.sendFile(__dirname + '/operations.html');
        });

        this.https = createServer({
            key: fs.readFileSync(key),
            cert: fs.readFileSync(cert),
            // requestCert: false,
            // rejectUnauthorized: false
        }, this.app)


        this.io = Io(this.https)
        let io = this.io;
        io.use(authMiddleware)
        

        this.https.listen(port, () => {
            console.log(`Server running on port ${JSON.stringify(this.https.address())}`);
            if (!this.initedRest && (callback !== undefined)) {
                console.log("Se inicio")
                this.initedRest = true;
                callback();
            }
        });

        this.io.on('connection', function (socket) {
            let token = socket.handshake.query.token;
            console.log(`On conection ${token}`)
            let s = <any>socket
            // console.log(`On conection ${JSON.stringify(s.jwtPayload)}`)
            // console.log(`On conection   `)

            // socket.on('chat message', function (data) {
            //     // let tokenT = socket.handshake.query.token;
            //     // console.log(`chat message ${tokenT}`)
            //     console.log(`Chat message **> ${JSON.stringify(data)}`);
            //     // socket.emit('', data)
            //     //socket.emit('chat message', data)
            //     socket.broadcast.emit('chat message', data);
            // });
        });


    }
    // /**
    //  * PrintStatus
    //  */
    // public printStatus() {
    //     console.log(`initedDB:${this.initedDB} initedRest:${this.initedRest} connection.isConnected:${this.connection ? this.connection.isConnected : ""}`)
    // }
}

export default App;
