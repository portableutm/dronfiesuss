// "use strict";
const nodemailer = require("nodemailer");
import { smtpPassword, smtpUrl, smtpUsername } from "../config/config";

let username = smtpUsername 
let pass = smtpPassword 

export let transporter = nodemailer.createTransport({
    host: smtpUrl, 
    port: 587,
    secure: false, 
    auth: {
        user: username, 
        pass: pass 
    }
});

export function verifyServer() {
    transporter.verify(function (error, success) {
        if (error) {
            console.log(error);
        } else {
            console.log("Server is ready to take our messages");
        }
        return error
    });
}

export async function sendTestMail() {
    
    let info = await transporter.sendMail({
        from: `"Lenemy" <${username}>`, 
        to: "jjcetraro@gmail.com, ealonzo@dronfies.com", 
        subject: "Hello ✔",
        text: "Hello world? 👻", 
        html: "<b>Hello world? 👻</b>" 
    });
    console.log("Message sent: %s", info.messageId);

    return info;
}


export async function sendMail(to:String[], subject:String, text:String, html:String) {
let info = await transporter.sendMail({
        from: `"Lenemy" <${username}>`, 
        to: to, 
        subject: subject, 
        text: text, 
        html: html, 
    });
    console.log("Message sent: %s", info.messageId);

    return info;
}
