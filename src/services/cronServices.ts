
const cron = require("node-cron");

import { schedule } from "node-cron";

export class CronService {
    tasks = {
    }

    constructor(){
        console.log("<>    CRON SERVICE     <>")
        this.tasks['operationCron'] = undefined;

        let operationCron = schedule("*/10 * * * * *", function() {
            console.log("------------------- >> running a task every minute");
        });
        operationCron.start();
        this.tasks['operationCron'] = operationCron;
    }

}


// let tasks = {}

// let operationCron = schedule("* * * * *", function() {
//     console.log("running a task every minute");
// });

// tasks['operationCron'] = operationCron;