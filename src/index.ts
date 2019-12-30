// import "reflect-metadata";

import App from "./app";
const controllers = [];
export let app : App;

if(process.env.NODE_ENV == "dev"){
    console.log("DEV env")
    app = new App(controllers, 3000, "dev");
    app.listen();
    
} else {
    
}

export function init(){
    console.log("Test env")
    app = new App(controllers, 3000, "test");
    app.listen();
    app.printStatus();
}
