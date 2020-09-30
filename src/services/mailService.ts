// "use strict";
const nodemailer = require("nodemailer");
import { smtpPassword, smtpUrl, smtpUsername, smtpPort } from "../config/config";

let username = smtpUsername
let pass = smtpPassword

let transportConfig = {
    host: smtpUrl,
    port: smtpPort,
    secure: false,
    auth: {
        user: username,
        pass: pass
    },
    tls : {
        // do not fail on invalid certs
        rejectUnauthorized: true
    }
}
if (process.env.NODE_ENV == "dev" || process.env.NODE_ENV == "test") {
    transportConfig.tls = {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
}

export let transporter = nodemailer.createTransport(transportConfig);

export function verifyServer() {
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            // console.log("Server is ready to take our messages");
        }
        return error
    });
}

export async function sendTestMail() {

    let info = await transporter.sendMail({
        from: `"Portable Utm" <${username}>`,
        to: "ealonzo@dronfies.com",
        subject: "Hello ✔",
        text: "Hello world? 👻",
        html: "<b>Hello world? 👻</b>"
    });
    // console.log("Message sent: %s", info.messageId);

    return info;
}


/**
 * 
 * @param to List of strings of mail to send to
 * @param subject Subject of mail
 * @param text Body of mail
 * @param html Body of mail in html format
 */
export async function sendMail(to: String[], subject: String, text: String, html: String) {
    let info = await transporter.sendMail({
        from: `"PortableUTM" <${username}>`,
        to: to,
        subject: subject,
        text: text,
        html: html,
    });
    // console.log("Message sent: %s", info.messageId);

    return info;
}
