export const jwtSecret: string =  process.env.JWTSECRET;//"@876fyivd&(&*%EH";
export const jwtExpTime: string =  process.env.JWT_EXPIRATION_TIME; //"1h";

if ((process.env.NODE_ENV=="production")  && (process.env.JWTSECRET=='' || process.env.JWTSECRET == "changeMe")){
    throw "You must set a valid JWTSECRET on .env file"
} 
	
export const cert = "./certificate/cert.pem"
export const key  = "./certificate/key.pem"
export const keyPhrase = "qwer1234qwer1234"

export const generateOnlyAdmin = false

export const smtpUrl = process.env.SMTP_URL
export const smtpUsername = process.env.SMTP_USERNAME
export const smtpPassword = process.env.SMTP_PASSWORD
export const smtpPort = process.env.SMTP_PORT
export const smtpSecure = JSON.parse(process.env.SMTP_SECURE) || false
export const smtpSelfsigned = JSON.parse(process.env.SMTP_SELF_SIGNED) || true

export const frontEndUrl = process.env.FRONT_END_URL ||  "http://localhost/"
export const backendUrl = process.env.BACKEND_URL ||  "http://localhost:4000/"

export const adminEmail = process.env.ADMIN_EMAIL? process.env.ADMIN_EMAIL.split(",")  : ["info@dronfies.com", "ealonzo@dronfies.com"]

export const uploadFolder = process.env.UPLOAD_FOLDER || "./src/uploads"

export const isDinacia = true



