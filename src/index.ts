// import "reflect-metadata";

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
