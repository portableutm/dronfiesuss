export const jwtSecret: string =  process.env.JWTSECRET;//"@876fyivd&(&*%EH";
export const jwtExpTime: string =  process.env.JWT_EXPIRATION_TIME; //"1h";

if ((process.env.NODE_ENV=="production")  && (process.env.JWTSECRET=='' || process.env.JWTSECRET == "changeMe")){
    throw "You must set a valid JWTSECRET on .env file"
} 

export const smtpUrl = process.env.SMTP_URL
export const smtpUsername = process.env.SMTP_USERNAME
export const smtpPassword = process.env.SMTP_PASSWORD
export const smtpPort = process.env.SMTP_PORT

export const frontEndUrl = process.env.FRONT_END_URL ||  "http://localhost:3000/"



