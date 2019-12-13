// import "reflect-metadata";
import * as express from 'express';
import {Request, Response} from "express";
import { createConnection, Connection, getConnection } from 'typeorm';

import {Routes} from "./routes";
import { initData } from "./databaseInit";
import { createTypeormConn } from "./databaseConfig";

class App {
    public app: express.Application;
    public port: number;
    public connection: Connection; // TypeORM connection to the database
    public connectionName: string;

    // The constructor receives an array with instances of the controllers for the application and an integer to designate the port number.
    constructor(controllers: any[], port: number, connName:string) {
        console.log(`Constructor-> port:${port} connName:${connName}`)
        this.app = express();
        this.port = port;
        this.connectionName = connName;


        this.initializeModels();
        this.initializeMiddlewares();
        this.initializeControllers(controllers);
        
    }

    private async initializeModels() {
        console.log(`Connection name ${this.connectionName}`)
        const connection : Connection = await createTypeormConn(this.connectionName);
        if (connection === undefined) { throw new Error('Error connecting to database'); } // In case the connection failed, the app stops.
        connection.synchronize(); // this updates the database schema to match the models' definitions
        this.connection = connection; // Store the connection object in the class instance.

       //Pegar aca
       initData(connection)

    }

    // Here we can add all the global middlewares for our application. (Those that will work across every contoller)
    private initializeMiddlewares() {
        this.app.use(express.json());
        Routes.forEach(route => {
            (this.app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    
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
    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }
}

export default App;
