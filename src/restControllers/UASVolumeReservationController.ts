
import {NextFunction, Request, Response} from "express";
import { UASVolumeReservationDao } from "../daos/UASVolumeReservationDao";

// import { app } from "../index";
// import { sendPositionToMonitor } from "../services/asyncBrowserComunication";


export class UASVolumeReservationController {

    private dao = new UASVolumeReservationDao()

    async all(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.all());
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return response.json(await this.dao.one(request.params.id));
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try{
            let entitie = await this.dao.save(request.body)
            return response.json(entitie);

        }catch(error){
            return response.sendStatus(400);
        }

    }

}