import { NextFunction, Request, Response } from "express";
import { fakeTime } from "../services/dateTimeService";


export class TestController {


    async changeDate(request: Request, response: Response, next: NextFunction) {
        let strDate = request.body.date
        let newDate = fakeTime(strDate)
        console.log("Test controller")
        console.log(newDate)
        return response.json(newDate);
    }



}