var fs = require("fs");
var CodeGen = require("swagger-typescript-codegen").CodeGen;
var yaml = require('js-yaml');  

let folders = [
    "nuss-operator-api",
    "uss-api",
    "uss-discovery-api",
    "vehicle"
]

let templatePath = folder => `swaggerFiles/${folder}/swagger.yaml` 
let substitutionString = (strName : String) => strName.replace(new RegExp("-", 'g'), "_")

function generateCode(folder){
    var file = templatePath(folder)
    var swagger = yaml.safeLoad(fs.readFileSync(file, 'utf8'));
    // var swagger = JSON.parse(fs.readFileSync(file, "UTF-8"));
    var tsSourceCode = CodeGen.getTypescriptCode({
      className: substitutionString(folder) ,
      swagger: swagger,
      imports: ["../../typings/tsd.d.ts"]
    });

    // Write data in 'Output.txt' . 
    fs.writeFile(`swaggerFiles/generatedCode/${folder}.ts`, tsSourceCode, (err) => { 
        // In case of a error throw err. 
        if (err) throw err; 
    }) 
}

folders.forEach(folder => {
    generateCode(folder)
});



