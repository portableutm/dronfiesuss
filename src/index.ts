import App from "./app";
const controllers = [];
export let app : App;

if(process.env.NODE_ENV != "test"){
    app = new App(controllers);
    app.listen();
}

// export function init(){
//     console.log("Test env")
//     if(app == undefined){
//         //if passed a port on process.env.PORT, will overwrite the port passed to app constructor
//         app = new App(controllers, 3000, "test");
//         app.listen();
//         app.printStatus();
//     }    
// }

export async function initAsync(){
    return new Promise(resolve => {
        if(app == undefined){
            console.log("><>< initAsync ><><")
            app = new App(controllers /*, 3000, "test" */, ()=>{
                console.log("app inicializated")
                resolve(app)
            });
        }else{
            resolve(app);
        }
      });
}
