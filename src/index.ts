import App from "./app";
const controllers = [];
export let app : App;

if(process.env.NODE_ENV == "dev"){
    console.log("DEV env")
    //if passed a port on process.env.PORT, will overwrite the port passed to app constructor
    app = new App(controllers, 3000, "dev");
    app.listen();
    
} else if(process.env.NODE_ENV == "cloud"){
    console.log("cloud env")
    //if passed a port on process.env.PORT, will overwrite the port passed to app constructor
    app = new App(controllers, 3000, "cloud");
    app.listen();
    
}
else if(process.env.NODE_ENV == "production"){
    console.log("cloud env")
    //if passed a port on process.env.PORT, will overwrite the port passed to app constructor
    app = new App(controllers, 3000, "cloud");
    app.listen();
    
}

export function init(){
    console.log("Test env")
    if(app == undefined){
        //if passed a port on process.env.PORT, will overwrite the port passed to app constructor
        app = new App(controllers, 3000, "test");
        app.listen();
        app.printStatus();
    }    
}

export async function initAsync(){
    return new Promise(resolve => {
        if(app == undefined){
            app = new App(controllers, 3000, "test", ()=>{
                // app.listen(()=>{
                //     app.printStatus();
                //     resolve();
                // });
                resolve();

            });
        }else{
            resolve();
        }
      });
}
