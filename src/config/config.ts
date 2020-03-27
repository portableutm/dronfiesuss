export const jwtSecret: string =  process.env.JWTSECRET;//"@876fyivd&(&*%EH";
export const jwtExpTime: string =  process.env.JWT_EXPIRATION_TIME; //"1h";

if ((process.env.NODE_ENV=="production")  && (process.env.JWTSECRET=='' || process.env.JWTSECRET == "changeMe")){
    throw "You must set a valid JWTSECRET on .env file"
} 


