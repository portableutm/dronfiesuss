import "reflect-metadata";
import * as express from 'express';
import {Request, Response} from "express";
import {  Connection} from 'typeorm';
var cors = require('cors')

import { Server } from "http";
import * as Io from "socket.io";


import {Routes} from "./routes";
import { initData } from "./databaseInit";
import { createTypeormConn } from "./databaseConfig";

class App {
    public app: express.Application;
    public port: number;
    public connection: Connection; // TypeORM connection to the database
    public connectionName: string;
    public io : SocketIO.Server;

    public initedDB : boolean = false;
    public initedRest : boolean = false;

    constructor(controllers: any[], port: number, connName:string, callback?:(param?:any)=>void) {
        console.log(`Constructor-> port:${port} connName:${connName}`)
        this.app = express();
        this.port = port;
        this.connectionName = connName;


        this.initializeModels(callback?callback:()=>{});
        this.initializeMiddlewares();
        // this.initializeControllers(controllers);
        
    }

    private async initializeModels(callback:()=>any) {

        console.log(`Connection name #${this.connectionName}#!`)
        const connection : Connection = await createTypeormConn(this.connectionName);
        if (connection === undefined) {
             throw new Error('Error connecting to database'); 
        } // In case the connection failed, the app stops.
        connection.synchronize(); // this updates the database schema to match the models' definitions
        
        this.connection = connection; // Store the connection object in the class instance.

       //Pegar aca
       await initData(connection, () => {
           this.initedDB = true;
           callback()
       })
    }

    // Here we can add all the global middlewares for our application. (Those that will work across every contoller)
    private initializeMiddlewares() {
        this.app.use(express.json());
        this.app.use(cors())
        Routes.forEach(route => {
            (this.app as any)[route.method](route.route, route.middlewares ? route.middlewares:(req,res,next) => {return next()} , (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    // console.log(result)
                    // return result
                    
                    result.
                    then(result => {
                        console.log(`name ${result.constructor.name}`)
                        if(result.constructor.name === 'Object'){
                            // return result
                            result !== null && result !== undefined ? res.send(result) : undefined
                        }
                        else if(result.constructor.name === 'Array'){
                            result !== null && result !== undefined ? res.send(result) : undefined
                            // return result
                        }
                        else{
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
    
    private initializeControllers(controllers: any[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }

    // Boots the application
    public listen(callback? : (param?:any) => void ) {
        // var server = require('http').Server(app);
        let server = new Server(this.app)
        // var io = require('socket.io')(server);
        this.io = Io(server)
        let io = this.io;

        this.app.get('/', function (req, res) {
            res.sendFile(__dirname + '/index.html');
        });
          
        
        // this.app.listen(this.port, () => {
        //     console.log(`Server running on port ${this.port}`);
        // });

        server.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
            if(callback !== undefined){
                this.initedRest = true;
                callback();
                
            }
                
        });

        this.io.on('connection', function (socket) {
            // console.log("Cliente nuevo", socket.json)
            // socket.emit('news', { hello: 'world' });
            socket.on('chat message', function (data) {
                console.log(data);
                socket.emit('chat message', data)
                socket.broadcast.emit('chat message', data);
            });
        });
        

    }
    /**
     * PrintStatus
     */
    public printStatus() {
        console.log(`initedDB:${this.initedDB} initedRest:${this.initedRest} connection.isConnected:${this.connection?this.connection.isConnected:""}`)
    }
}

export default App;
